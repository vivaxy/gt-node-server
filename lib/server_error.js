/**
 * @since 2019-05-24 08:06
 * @author vivaxy
 */
const HTTP_STATUS_CODES = require('../configs/http_status_codes');

module.exports = class ServerError extends Error {
  constructor() {
    const message = arguments[arguments.length - 1];
    super(message);
    this.message = message;
    if (arguments.length === 2) {
      this.status = arguments[0];
    } else {
      this.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
  }
};
