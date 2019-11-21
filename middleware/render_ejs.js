/**
 * @since 2019-11-21 03:50
 * @author vivaxy
 * @requires ./router.js
 */
const path = require('path');
const ejs = require('ejs');
const fse = require('fs-extra');

const ejsExt = '.ejs';

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
  async handler(ctx, next) {
    if (!ctx.router.relativePath) {
      throw new Error('Requires ./routers');
    }
    if (!pathToRender[ctx.router.relativePath]) {
      pathToRender[ctx.router.relativePath] = await getRender(
        ctx.router.relativePath
      );
    }
    ctx.render = pathToRender[ctx.router.relativePath];
    await next();
  },
};
