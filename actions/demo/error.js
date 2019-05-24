/**
 * @since 2019-05-24 08:11
 * @author vivaxy
 */
exports.get = function get({ ServerError }) {
  throw new ServerError('server error message');
};
