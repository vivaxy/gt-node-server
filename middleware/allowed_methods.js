/**
 * @since 2019-05-24 07:31
 * @author vivaxy
 */
const router = require('./routers').router;

module.exports = {
  init() {},
  handler: router.allowedMethods(),
};
