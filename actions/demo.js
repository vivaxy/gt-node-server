const httpMethods = require('../configs/httpMethods.js');
const ArgTypes = require('../lib/ArgTypes.js');

exports[httpMethods.GET] = function get({ args, render, httpStatusCodes }) {
  return {
    status: httpStatusCodes.OK,
    body: render(args),
  };
};

exports.argTypes = {
  name: ArgTypes.string.isRequired,
  age: ArgTypes.number,
};

exports.defaultArgs = {
  age: 18,
};
