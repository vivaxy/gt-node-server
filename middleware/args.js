/**
 * @since 2019-11-21 04:30
 * @author vivaxy
 */
const path = require('path');

const httpMethods = require('../configs/http_methods');
const ArgTypes = require('../lib/arg_types');

function getArgs(ctx) {
  switch (ctx.request.method) {
    case httpMethods.GET:
      return { ...ctx.request.query, ...ctx.request.params };
    case httpMethods.POST:
      return { ...ctx.request.params, ...ctx.request.body };
  }
}

module.exports = {
  init() {},
  async handler(ctx, next) {
    if (!ctx.routers) {
      throw new Error('Requires ./router');
    }
    const { argTypes, defaultArgs } = require(path.join(
      '..',
      'actions',
      ctx.routers.relativePath
    ));
    const args = getArgs(ctx);
    if (argTypes) {
      try {
        ArgTypes.check(argTypes, args);
      } catch (ex) {
        ctx.status = httpStatusCodes.BAD_REQUEST;
        ctx.body = ex.message;
        return;
      }
    }
    ctx.args = ArgTypes.merge(args, defaultArgs);
    ctx.ArgTypes = ArgTypes;
    await next();
  },
};
