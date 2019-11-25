/**
 * @since 2019-07-28 20:52:34
 * @author vivaxy
 */
const path = require('path');
const React = require('react');
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
    const files = await glob('**/*.js', {
      cwd: path.join(__dirname, '..', 'build', 'client'),
    });
    this.staticFiles = {};
    await files.map(async (file) => {
      const content = await fse.readFile(
        path.join(__dirname, '..', 'build', 'client', file),
        'utf8'
      );
      const filename = path.join('_build', file);
      this.staticFiles['/' + filename] = content;
    });
  },
  handler: async function renderReact(ctx, next) {
    // response static files
    if (this.staticFiles[ctx.path]) {
      ctx.body = this.staticFiles[ctx.path];
    }

    if (!ctx.routers) {
      await next();
      return;
    }

    ctx.renderReact = async function(data) {
      const { relativePath } = ctx.routers;
      if (!pathToRender[relativePath]) {
        pathToRender[relativePath] = await getRender(relativePath);
      }

      ctx.set('Content-Type', 'text/html');

      const App = require(path.join('..', 'build', 'server', relativePath))
        .default;
      // TODO: start webpack-dev-middleware
      const reactStream = ReactDOMServer.renderToNodeStream(
        React.createElement(App)
      );
      return pathToRender[relativePath]({
        ...data,
        STYLES: '<link rel="stylesheet" href="/_build/index.css">',
        SCRIPTS: '<script src="/_build' + relativePath + '.js"></script>',
        HTML: reactStream,
        DUMP: JSON.stringify({}),
      });
    };
    await next();
  },
};
