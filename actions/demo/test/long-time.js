/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

import httpMethods from '../../../conf/httpMethods';
import Action from '../../../lib/Action';
import ArgTypes from '../../../lib/ArgTypes';
import logger from '../../../lib/logger';

const sleep = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

export default class extends Action {
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
}
