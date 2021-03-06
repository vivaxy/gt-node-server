/**
 * @since 2019-07-28 20:52:34
 * @author vivaxy
 */
const path = require('path');
const http = require('http');
const fse = require('fs-extra');
const glob = require('fast-glob');
const ejs = require('ejs-stream2');
const compose = require('koa-compose');
const ReactDOMServer = require('react-dom/server');

const PATHS = require('../configs/paths');
const HTTP_METHODS = require('../configs/http_methods');
const HTTP_STATUS_CODES = require('../configs/http_status_codes');

const ejsExt = '.ejs';
const pathToRender = {};

async function getRender(relativePath) {
  const pageRendererFile = path.join(
    PATHS.rootPath,
    PATHS.viewsFolder,
    relativePath + ejsExt
  );
  const fileExists = await fse.pathExists(pageRendererFile);
  if (fileExists) {
    const fileContent = await fse.readFile(pageRendererFile, 'utf8');
    return ejs.compile(fileContent, {});
  }
  return () => {
    throw new Error('Missing view for: ' + relativePath);
  };
}

module.exports = {
  init: async function initRenderReact() {
    // response static files
    const files = await glob('**/*.{js,css}', {
      cwd: path.join(PATHS.rootPath, PATHS.buildClientFolder),
    });
    this.staticFiles = {};
    await files.map(async (file) => {
      const content = await fse.readFile(
        path.join(PATHS.rootPath, PATHS.buildClientFolder, file),
        'utf8'
      );
      const filename = path.join(PATHS.serverClientRouter, file);
      this.staticFiles['/' + filename] = content;
    });
  },
  handler: async function renderReact(ctx, next) {
    // response static files
    if (this.staticFiles[ctx.path]) {
      ctx.body = this.staticFiles[ctx.path];
      ctx.type = path.extname(ctx.path);
    }

    if (!ctx._matchedRoute) {
      await next();
      return;
    }

    ctx.renderReact = async function(options) {
      const { __ssr: ssr, ...data } = options;
      const matchedRoute = ctx._matchedRoute;
      if (!pathToRender[matchedRoute]) {
        pathToRender[matchedRoute] = await getRender(matchedRoute);
      }

      ctx.set('Content-Type', 'text/html');

      if (ssr) {
        const app = require(path.join(
          PATHS.rootPath,
          PATHS.buildServerFolder,
          matchedRoute
        ));
        // fetch server data
        const koaApp = await require('../lib/server');
        const newCtx = koaApp.createContext(
          ctx.req,
          new http.ServerResponse({})
        );
        ctx.search = '';
        newCtx.fetch = async function fetch({ path, data, method, headers }) {
          const fnMiddleware = compose(koaApp.middleware);
          const fetchCtx = koaApp.createContext(
            ctx.req,
            new http.ServerResponse({})
          );
          fetchCtx.__simulated = true;
          fetchCtx.path = path;
          fetchCtx.method = method;
          if (headers) {
            Object.keys(headers).forEach(function(headerKey) {
              fetchCtx.set(headerKey, headers[headerKey]);
            });
          }
          if (
            fetchCtx.method === HTTP_METHODS.GET ||
            fetchCtx.method === HTTP_METHODS.HEAD
          ) {
            fetchCtx.query = data;
          } else if (fetchCtx.method === HTTP_METHODS.POST) {
            // bodyparser will try to read body according to the content-type and content-length
            fetchCtx.request.body = data;
          } else {
            throw new Error('Fetch method not supported: ' + method);
          }
          await fnMiddleware(fetchCtx);
          if (fetchCtx.status === HTTP_STATUS_CODES.OK) {
            return fetchCtx.body;
          }
          throw new Error(http.STATUS_CODES[fetchCtx.status]);
        };
        await app.initialize(newCtx);

        // render react app
        const reactStream = ReactDOMServer.renderToNodeStream(app.default);
        return pathToRender[matchedRoute]({
          ...data,
          __styles: `<link rel="stylesheet" href="/${PATHS.serverClientRouter}${matchedRoute}.css">`,
          __scripts: `<script src="/${PATHS.serverClientRouter}${matchedRoute}.js"></script>`,
          __html: reactStream,
          __state: JSON.stringify(app.getState()),
        });
      } else {
        return pathToRender[matchedRoute]({
          ...data,
          __styles: `<link rel="stylesheet" href="/${PATHS.serverClientRouter}${matchedRoute}.css">`,
          __scripts: `<script src="/${PATHS.serverClientRouter}${matchedRoute}.js"></script>`,
          __html: '',
          __state: JSON.stringify(null),
        });
      }
    };
    await next();
  },
};
