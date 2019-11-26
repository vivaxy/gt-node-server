/**
 * @since 2017-01-28 19:28
 * @author vivaxy
 */
const koaBody = require('koa-body');

module.exports = {
  init() {},
  handler: async function bodyParser(ctx, next) {
    if (!ctx.__simulated) {
      await koaBody({ multipart: true })(ctx, next);
    } else {
      await next();
    }
  },
};
