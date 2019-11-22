/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */
const getLogger = require('../lib/get_logger');

module.exports = {
  init() {},
  handler: async function logger(ctx, next) {
    if (!ctx.router) {
      throw new Error('Requires ./router');
    }
    ctx.logger = getLogger(ctx.router.relativePath);
    await next();
  },
};
