/**
 * @since 2019-11-21 04:30
 * @author vivaxy
 */
const path = require('path');

const PATHS = require('../configs/paths');
const ArgTypes = require('../lib/arg_types');
const HTTP_METHODS = require('../configs/http_methods');
const HTTP_STATUS_CODES = require('../configs/http_status_codes');

function getArgs(ctx) {
  switch (ctx.request.method) {
    case HTTP_METHODS.GET:
    case HTTP_METHODS.HEAD:
      return { ...ctx.query, ...ctx.params };
    case HTTP_METHODS.POST:
      return { ...ctx.params, ...ctx.request.body };
  }
}

module.exports = {
  handler: async function args(ctx, next) {
    if (!ctx._matchedRoute) {
      await next();
      return;
    }
    const { argTypes, defaultArgs } = require(path.join(
      PATHS.rootPath,
      PATHS.actionsFolder,
      ctx._matchedRoute
    ));
    const args = getArgs(ctx);
    if (argTypes) {
      try {
        ArgTypes.check(argTypes, args);
      } catch (ex) {
        ctx.status = HTTP_STATUS_CODES.BAD_REQUEST;
        ctx.body = ex.message;
        return;
      }
    }
    ctx.args = ArgTypes.merge(args, defaultArgs);
    ctx.ArgTypes = ArgTypes;
    await next();
  },
};
