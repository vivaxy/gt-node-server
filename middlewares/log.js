/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */

const logger = require('../lib/logger.js');

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

module.exports = async (ctx, next) => {
  const request = ctx.request;

  const startTime = getTimeStamp();

  try {
    await next();
  } catch (ex) {
    logger.error(ex);
  }
  logger.info(
    `[request] ${request.method} ${request.path}; params=${stringify(
      ctx.params
    )}, query=${stringify(ctx.query)}, body=${stringify(
      ctx.request.body
    )}; [response] status=${ctx.status}, body=${stringify(
      ctx.body
    )}; [time] ${getTimeStamp() - startTime}ms`
  );
};
