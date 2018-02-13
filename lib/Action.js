import http from 'http';
import httpMethods from '../conf/httpMethods';
import httpStatusCodes from '../conf/httpStatusCodes';
import ArgTypes from './ArgTypes';

/**
 * Use params first
 * @param ctx
 * @returns {{}}
 */
const getArgsFromRequest = ctx => {
    switch (ctx.request.method) {
        case httpMethods.GET:
            return { ...ctx.request.query, ...ctx.request.params };
        case httpMethods.POST:
            return { ...ctx.request.body, ...ctx.request.params };
    }
};

export default class Action {
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
        this.setStatusAndBodyByStatusCode(httpStatusCodes.METHOD_NOT_ALLOWED);
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

    setStatusAndBodyByStatusCode(code) {
        this.setStatus(code);
        this.setBody(http.STATUS_CODES[code]);
    }
}
