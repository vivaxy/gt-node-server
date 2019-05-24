/**
 * @since 2019-05-24 08:06
 * @author vivaxy
 */
const httpStatusCodes = require('../configs/httpStatusCodes');

module.exports = class ServerError extends Error {
  constructor() {
    const message = arguments[arguments.length - 1];
    super(message);
    this.message = message;
    if (arguments.length === 2) {
      this.status = arguments[0];
    } else {
      this.status = httpStatusCodes.INTERNAL_SERVER_ERROR;
    }
  }
};
