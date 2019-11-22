/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */
const getLogger = require('../lib/get_logger');

const logger = getLogger('middleware:app_logger');

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
    return '[object Stream]';
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
  handler: async function appLogger(ctx, next) {
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
