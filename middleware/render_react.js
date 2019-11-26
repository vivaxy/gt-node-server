/**
 * @since 2019-07-28 20:52:34
 * @author vivaxy
 */
const path = require('path');
const fse = require('fs-extra');
const glob = require('fast-glob');
const ejs = require('ejs-stream2');
const ReactDOMServer = require('react-dom/server');

const ejsExt = '.ejs';
const pathToRender = {};

async function getRender(relativePath) {
  const pageRendererFile = path.join(
    __dirname,
    '..',
    'views',
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
      cwd: path.join(__dirname, '..', 'build', 'client'),
    });
    this.staticFiles = {};
    await files.map(async (file) => {
      const content = await fse.readFile(
        path.join(__dirname, '..', 'build', 'client', file),
        'utf8'
      );
      const filename = path.join('__build', file);
      this.staticFiles['/' + filename] = content;
    });
  },
  handler: async function renderReact(ctx, next) {
    // response static files
    if (this.staticFiles[ctx.path]) {
      ctx.body = this.staticFiles[ctx.path];
      ctx.type = path.extname(ctx.path);
    }

    if (!ctx.routers) {
      await next();
      return;
    }

    ctx.renderReact = async function(options) {
      const { __ssr: ssr, ...data } = options;
      const { relativePath } = ctx.routers;
      if (!pathToRender[relativePath]) {
        pathToRender[relativePath] = await getRender(relativePath);
      }

      ctx.set('Content-Type', 'text/html');

      if (ssr) {
        const app = require(path.join('..', 'build', 'server', relativePath));
        // TODO: start webpack-dev-middleware
        const reactStream = ReactDOMServer.renderToNodeStream(app.default);
        return pathToRender[relativePath]({
          ...data,
          __styles: `<link rel="stylesheet" href="/__build${relativePath}.css">`,
          __scripts: `<script src="/__build${relativePath}.js"></script>`,
          __html: reactStream,
          __state: JSON.stringify(app.getState()),
        });
      } else {
        return pathToRender[relativePath]({
          ...data,
          __styles: `<link rel="stylesheet" href="/__build${relativePath}.css">`,
          __scripts: `<script src="/__build${relativePath}.js"></script>`,
          __html: '',
          __state: JSON.stringify(null),
        });
      }
    };
    await next();
  },
};
