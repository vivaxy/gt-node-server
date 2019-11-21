/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */
const ArgTypes = require('../../lib/arg_types.js');

exports.post = function post(ctx) {
  return {
    code: 0,
    data: {
      body: ctx.request.body,
      query: ctx.query,
      params: ctx.params,
      args: ctx.args,
    },
  };
};

exports.argTypes = {
  id: ArgTypes.string.isRequired,
};
