/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */

const logger = require('../lib/get_logger.js')('middleware:log');

function getTimeStamp() {
  return new Date().getTime();
}

function stringify(body = {}) {
  if (body === null) {
    return null;
  }
  if (typeof body === 'string') {
    return body;
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
    return body.toString();
  }
}

function format(body = {}) {
  const bodyString = stringify(body);
  const maxLength = 50;
  if (bodyString.length > maxLength) {
    return bodyString.slice(0, maxLength - 3) + '...';
  }
  return bodyString;
}

module.exports = {
  init() {},
  async handler(ctx, next) {
    const request = ctx.request;

    logger.info(
      `<- ${request.method} ${request.path} params=${format(
        ctx.params
      )} query=${format(ctx.query)} body=${format(ctx.request.body)}`
    );

    const startTime = getTimeStamp();

    try {
      await next();
    } catch (ex) {
      logger.error(ex);
    }

    logger.info(
      `-> ${request.method} ${request.path} ${ctx.status} ${getTimeStamp() -
        startTime}ms body=${format(ctx.body)}`
    );
  },
};
