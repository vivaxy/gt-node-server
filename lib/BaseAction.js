const http = require('http');

const httpStatusCodes = require('../conf/httpStatusCodes.js');

module.exports = class BaseAction {
  constructor(ctx) {
    this.ctx = ctx;
    this.method = ctx.request.method;
  }

  async execute() {
    const status = httpStatusCodes.METHOD_NOT_ALLOWED;
    this.ctx.status = status;
    this.ctx.body = http.STATUS_CODES[status];
  }
};
