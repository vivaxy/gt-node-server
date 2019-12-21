/**
 * @since 2019-12-21 07:43
 * @author vivaxy
 */
const ArgTypes = require('../lib/arg_types.js');

exports.get = function get(ctx) {
  return ctx.renderEJS({
    title: 'Demo',
    args: ctx.args,
  });
};

exports.argTypes = {
  name: ArgTypes.string.isRequired,
  age: ArgTypes.number,
};

exports.defaultArgs = {
  age: 18,
};
