/**
 * @since 20180813 19:06
 * @author vivaxy
 */

const ArgsAction = require('./ArgsAction.js');
const httpMethods = require('../conf/httpMethods.js');
const httpStatusCodes = require('../conf/httpStatusCodes.js');

/**
 * Use params first
 * @param ctx
 * @returns {{}}
 */
const getArgsFromRequest = (ctx) => {
  switch (ctx.request.method) {
    case httpMethods.GET:
      return { ...ctx.request.query, ...ctx.request.params };
    case httpMethods.POST:
      return { ...ctx.request.body, ...ctx.request.params };
  }
  return {};
};

module.exports = class MethodsAction extends ArgsAction {
  async execute() {
    const { method } = this;
    const handler = this[method.toLowerCase()];
    if (!handler) {
      // method not allowed
      return super.execute();
    }

    try {
      this.validate(getArgsFromRequest(this.ctx));
    } catch (ex) {
      this.ctx.status = httpStatusCodes.BAD_REQUEST;
      this.ctx.body = ex.message;
      return;
    }

    try {
      const resp = await handler.call(this, this.args);
      if (!resp.status) {
        resp.status = httpStatusCodes.OK;
      }
      this.ctx.status = resp.status;
      this.ctx.body = resp.body;
      if (resp.headers) {
        Object.keys(headers).map((key, value) => {
          this.ctx.set(key, value);
        });
      }
    } catch (ex) {
      this.ctx.status = httpStatusCodes.INTERNAL_SERVER_ERROR;
      this.ctx.body = ex.message;
    }
  }
};
