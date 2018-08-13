/**
 * @since 20180212 16:03
 * @author vivaxy
 */

const http = require('http');
const httpStatusCodes = require('../conf/httpStatusCodes.js');
const BaseAction = require('./BaseAction.js');

module.exports = class NotFoundAction extends BaseAction {
  execute() {
    const status = httpStatusCodes.NOT_FOUND;
    this.ctx.status = status;
    this.ctx.body = http.STATUS_CODES[status];
  }
};
