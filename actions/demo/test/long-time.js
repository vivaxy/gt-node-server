/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

const MethodsAction = require('../../../lib/MethodsAction.js');
const logger = require('../../../lib/logger.js');

const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

module.exports = class extends MethodsAction {
  constructor(ctx) {
    super(ctx);
  }

  async get() {
    logger.debug('long time start');
    await sleep(10000);
    logger.debug('long time end');
    return {
      body: {
        code: 0,
      },
    };
  }
};
