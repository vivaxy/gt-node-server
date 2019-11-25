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
  init() {},
  handler: async function renderEJS(ctx, next) {
    if (!ctx.routers) {
      await next();
      return;
    }
    ctx.renderEJS = async function(data) {
      const { relativePath } = ctx.routers;
      if (!pathToRender[relativePath]) {
        pathToRender[relativePath] = await getRender(relativePath);
      }
      ctx.set('Content-Type', 'text/html');
      return pathToRender[ctx.routers.relativePath](data);
    };
    await next();
  },
};
