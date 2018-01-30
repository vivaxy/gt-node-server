const httpStatusCodes = require('../conf/httpStatusCodes');
const httpMethods = require('../conf/httpMethods');
const Action = require('../lib/Action');
const ArgTypes = require('../lib/ArgTypes');

class Demo extends Action {
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
}

Demo.methods = [httpMethods.GET];
module.exports = Demo;
