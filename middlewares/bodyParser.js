/**
 * @since 2017-01-28 19:28
 * @author vivaxy
 */

const koaBody = require('koa-body');

module.exports = {
  init() {},
  middleware: koaBody({ multipart: true }),
};
