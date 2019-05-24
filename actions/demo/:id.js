/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

const httpMethods = require('../../configs/httpMethods.js');
const ArgTypes = require('../../lib/ArgTypes.js');

exports[httpMethods.POST] = function post({ args, ctx }) {
  return {
    body: {
      code: 0,
      data: {
        body: ctx.request.body,
        query: ctx.query,
        params: ctx.params,
        args,
      },
    },
  };
};

exports.argTypes = {
  id: ArgTypes.string.isRequired,
};
