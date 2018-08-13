const httpStatusCodes = require('../conf/httpStatusCodes.js');
const MethodsAction = require('../lib/MethodsAction.js');
const ArgTypes = require('../lib/ArgTypes.js');

module.exports = class extends MethodsAction {
  constructor(ctx) {
    super(ctx);
    this.argTypes = {
      name: ArgTypes.string.isRequired,
      age: ArgTypes.number,
    };
    this.defaultArgs = {
      age: 18,
    };
  }

  get(args) {
    return {
      status: httpStatusCodes.OK,
      body: this.render(args),
    };
  }

  render(args) {
    return `<!doctype html>
<html>
<head>
head
</head>
<body>
body
</body>
</html>`;
  }
};
