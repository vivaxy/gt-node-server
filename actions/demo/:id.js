/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

const httpMethods = require('../../conf/httpMethods');
const Action = require('../../lib/Action');
const ArgTypes = require('../../lib/ArgTypes');

class Id extends Action {
    constructor(ctx) {
        super(ctx);
        this.argTypes = {
            id: ArgTypes.string.isRequired
        };
    }

    post(args) {
        this.render({
            code: 0,
            data: {
                body: this.ctx.request.body,
                query: this.ctx.query,
                params: this.ctx.params,
                args
            }
        });
    }
}

Id.methods = [httpMethods.POST];
module.exports = Id;
