const ArgTypes = require('../lib/arg_types.js');

exports.get = function get({ args, render }) {
  return render({
    title: 'Demo',
    args,
  });
};

exports.argTypes = {
  name: ArgTypes.string.isRequired,
  age: ArgTypes.number,
};

exports.defaultArgs = {
  age: 18,
};
