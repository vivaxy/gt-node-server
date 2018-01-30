/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

const httpMethods = require('../../../conf/httpMethods');
const Action = require('../../../lib/Action');
const ArgTypes = require('../../../lib/ArgTypes');
const logger = require('../../../lib/logger');

const sleep = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

module.exports = class extends Action {
    constructor(ctx) {
        super(ctx);
    }

    async get() {
        logger.debug('long time start');
        await sleep(10000);
        this.setBody({
            code: 0
        });
        logger.debug('long time end');
    }
};
