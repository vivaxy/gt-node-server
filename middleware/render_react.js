/**
 * @since 2019-07-28 20:52:34
 * @author vivaxy
 */
const path = require('path');
const React = require('react');
const fse = require('fs-extra');
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
  init() {},
  handler: async function renderReact(ctx, next) {
    if (!ctx.routers) {
      await next();
      return;
    }
    const { relativePath } = ctx.routers;
    if (!pathToRender[relativePath]) {
      pathToRender[relativePath] = await getRender(relativePath);
    }
    ctx.renderReact = function(data) {
      ctx.set('Content-Type', 'text/html');
      // TODO: require server bundle
      // TODO: start webpack-dev-middleware
      const reactStream = ReactDOMServer.renderToNodeStream(
        React.createElement('div', { className: 'root' }, 'haha')
      );
      return pathToRender[relativePath]({
        ...data,
        STYLES: '<link rel="stylesheet" href="style.css">',
        SCRIPTS: '<script src="scripts.js"></script>',
        HTML: reactStream,
        DUMP: JSON.stringify({}),
      });
    };
    await next();
  },
};
