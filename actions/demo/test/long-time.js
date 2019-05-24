/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */
const httpMethods = require('../../../configs/httpMethods.js');

const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

exports[httpMethods.GET] = async function get({ logger }) {
  logger.debug('long time start');
  await sleep(10000);
  logger.debug('long time end');
  return {
    body: {
      code: 0,
    },
  };
};
