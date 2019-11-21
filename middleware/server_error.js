/**
 * @since 2019-11-21 04:28
 * @author vivaxy
 */
const ServerError = require('../lib/server_error');
module.exports = {
  init() {},
  async handler(ctx, next) {
    ctx.ServerError = ServerError;
    await next();
  },
};
