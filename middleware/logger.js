/**
 * @since 2019-11-21 04:50
 * @author vivaxy
 */
const getLogger = require('../lib/get_logger');

module.exports = {
  init() {},
  async handler(ctx, next) {
    if (!ctx.router) {
      throw new Error('Requires ./router.js');
    }
    ctx.logger = getLogger(ctx.router.relativePath);
    await next();
  },
};
