const httpStatusCodes = require('../conf/httpStatusCodes');
const httpMethods = require('../conf/httpMethods');
const Action = require('../lib/Action');
const ArgTypes = require('../lib/ArgTypes');

module.exports = class extends Action {
    constructor(ctx) {
        super(ctx);
        this.argTypes = {
            name: ArgTypes.string.isRequired,
            age: ArgTypes.number
        };
        this.defaultArgs = {
            age: 18
        };
    }

    get(args) {
        this.setStatus(httpStatusCodes.OK);
        this.setBody(args);
    }
};
