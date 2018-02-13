/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

import httpMethods from '../../conf/httpMethods';
import Action from '../../lib/Action';
import ArgTypes from '../../lib/ArgTypes';

export default class extends Action {
    constructor(ctx) {
        super(ctx);
        this.argTypes = {
            id: ArgTypes.string.isRequired
        };
    }

    post(args) {
        this.setBody({
            code: 0,
            data: {
                body: this.ctx.request.body,
                query: this.ctx.request.query,
                params: this.ctx.request.params,
                args
            }
        });
    }
}
