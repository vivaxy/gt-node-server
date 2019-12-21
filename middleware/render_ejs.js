/**
 * @since 2019-11-21 03:50
 * @author vivaxy
 */
const path = require('path');
const fse = require('fs-extra');
const ejs = require('ejs-stream2');

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
  handler: async function renderEJS(ctx, next) {
    if (!ctx._matchedRoute) {
      await next();
      return;
    }
    ctx.renderEJS = async function(data) {
      const matchedRoute = ctx._matchedRoute;
      if (!pathToRender[matchedRoute]) {
        pathToRender[matchedRoute] = await getRender(matchedRoute);
      }
      ctx.set('Content-Type', 'text/html');
      return pathToRender[matchedRoute](data);
    };
    await next();
  },
};
