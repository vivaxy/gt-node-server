/**
 * @since 2017-01-06 16:45
 * @author vivaxy
 */

if (!global._babelPolyfill) {
    require('babel-polyfill');
}
require('babel-register');
module.exports = require('./gt/index');
