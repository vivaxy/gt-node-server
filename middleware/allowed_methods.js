/**
 * @since 2019-05-24 07:31
 * @author vivaxy
 */

const router = require('./actions_by_routers.js').router;

module.exports = {
  init() {},
  handler: router.allowedMethods(),
};
