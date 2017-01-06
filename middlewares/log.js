/**
 * @since 2016-12-07 20:23
 * @author vivaxy
 */

import logger from '../lib/logger';

export default async(ctx, next) => {

    const request = ctx.request;
    const response = ctx.response;

    logger.info(`request.path: ${request.path}`);
    try {
        await next();
    } catch (ex) {
        logger.error(ex);
    }
}
