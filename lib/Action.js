const httpMethods = require('../conf/httpMethods');
const httpStatusCodes = require('../conf/httpStatusCodes');
const ArgTypes = require('./ArgTypes');

const getArgsFromRequest = ctx => {
    switch (ctx.request.method) {
        case httpMethods.GET:
            return { ...ctx.query, ...ctx.params };
        case httpMethods.POST:
            return { ...ctx.request.body, ...ctx.params };
    }
};

class Action {
    constructor(ctx) {
        this.argTypes = {};
        this.defaultArgs = {};

        this.ctx = ctx;
        this.method = ctx.request.method;
        this.args = {};
    }

    validate(args) {
        ArgTypes.check(this.argTypes, args);
        return ArgTypes.merge(args, this.defaultArgs);
    }

    async execute() {
        const { method } = this;
        if (this[method.toLowerCase()]) {
            try {
                this.args = this.validate(getArgsFromRequest(this.ctx));
            } catch (ex) {
                this.setStatus(httpStatusCodes.BAD_REQUEST);
                this.setBody(ex.message);
                return;
            }
            return await this[method.toLowerCase()](this.args);
        }
    }

    setHeader(key, value) {
        return this.ctx.response.set(key, value);
    }

    setStatus(code) {
        return (this.ctx.response.status = code);
    }

    setBody(body) {
        return (this.ctx.response.body = body);
    }
}

Action.methods = [httpMethods.GET];
module.exports = Action;
