/**
 * @since 2019-07-28 20:52:34
 * @author vivaxy
 */
module.exports = {
  init() {},
  async handler(ctx, next) {
    await next();
  },
};
