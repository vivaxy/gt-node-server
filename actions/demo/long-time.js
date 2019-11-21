/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */
const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

exports.get = async function get(ctx) {
  ctx.logger.debug('long time start');
  await sleep(10000);
  ctx.logger.debug('long time end');
  return {
    code: 0,
  };
};
