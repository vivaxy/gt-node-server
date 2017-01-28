/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */

import logger from '../lib/logger';

const getTimeStamp = () => {
    return new Date().getTime();
};

export default async(ctx, next) => {

    const request = ctx.request;

    const startTime = getTimeStamp();

    try {
        await next();
    } catch (ex) {
        logger.error(ex);
    }
    logger.info(`[${request.method}] ${request.path} in ${getTimeStamp() - startTime}ms`);
}
