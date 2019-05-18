/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */

const log4js = require('../lib/log4js.js');

const getTimeStamp = () => {
  return new Date().getTime();
};

const stringify = (body = {}) => {
  if (body === null) {
    return null;
  }
  if (typeof body.pipe === 'function') {
    return '[object stream]';
  }
  try {
    return JSON.stringify(body, (k, v) => {
      if (Array.isArray(v)) {
        return [v.length];
      }
      return v;
    });
  } catch (ex) {
    return body;
  }
};

const logger = log4js.getLogger('middleware:log');

module.exports = async (ctx, next) => {
  const request = ctx.request;

  logger.info(
    `<- ${request.method} ${request.path} params=${stringify(
      ctx.params
    )} query=${stringify(ctx.query)} body=${stringify(ctx.request.body)}`
  );

  const startTime = getTimeStamp();

  try {
    await next();
  } catch (ex) {
    logger.error(ex);
  }

  logger.info(
    `-> ${request.method} ${request.path} ${ctx.status} ${getTimeStamp() -
      startTime}ms body=${stringify(ctx.body)}`
  );
};
