/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */
const getLogger = require('../lib/get_logger');

module.exports = {
  handler: async function logger(ctx, next) {
    if (ctx._matchedRoute) {
      ctx.logger = getLogger(ctx._matchedRoute);
    }

    await next();
  },
};
