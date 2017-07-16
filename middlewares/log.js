/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */

const logger = require('../lib/logger');

const getTimeStamp = () => {
    return new Date().getTime();
};

module.exports = async(ctx, next) => {
    const request = ctx.request;

    const startTime = getTimeStamp();

    try {
        await next();
    } catch (ex) {
        logger.error(ex);
    }
    logger.info(`[request] ${request.method} ${request.path} in ${getTimeStamp() - startTime}ms`);
};
