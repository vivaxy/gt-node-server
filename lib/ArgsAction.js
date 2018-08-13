/**
 * @since 20180813 18:40
 * @author vivaxy
 */

const BaseAction = require('./BaseAction.js');
const ArgTypes = require('./ArgTypes.js');

module.exports = class ArgsAction extends BaseAction {
  constructor(ctx) {
    super(ctx);
    this.argTypes = {};
    this.defaultArgs = {};
    this.args = {};
  }

  validate(args) {
    ArgTypes.check(this.argTypes, args);
    this.args = ArgTypes.merge(args, this.defaultArgs);
  }
};
