const ArgTypes = require('../lib/ArgTypes.js');

exports.get = function get({ args, render, httpStatusCodes }) {
  return render(args);
};

exports.argTypes = {
  name: ArgTypes.string.isRequired,
  age: ArgTypes.number,
};

exports.defaultArgs = {
  age: 18,
};
