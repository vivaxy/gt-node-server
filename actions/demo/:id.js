/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

const MethodsAction = require('../../lib/MethodsAction.js');
const ArgTypes = require('../../lib/ArgTypes.js');

module.exports = class extends MethodsAction {
  constructor(ctx) {
    super(ctx);
    this.argTypes = {
      id: ArgTypes.string.isRequired,
    };
  }

  post(args) {
    return {
      body: {
        code: 0,
        data: {
          body: this.ctx.request.body,
          query: this.ctx.request.query,
          params: this.ctx.request.params,
          args,
        },
      },
    };
  }
};
