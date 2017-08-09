/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

const logger = require('../../../lib/logger');

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

exports.action = async(ctx, next) => {
    logger.debug('long time start');
    await sleep(10000);
    ctx.body = {
        code: 0,
    };
    logger.debug('long time end');
};
