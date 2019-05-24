/**
 * @since 2019-05-24 07:31
 * @author vivaxy
 */

const router = require('./routers.js').router;

module.exports = {
  init() {},
  middleware: router.allowedMethods(),
};
