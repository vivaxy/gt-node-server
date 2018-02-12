/**
 * @since 2017-01-06 16:37
 * @author vivaxy
 */

require = require('@std/esm')(module, { esm: 'js', cjs: true });
const start = require('./lib/server').default;
start();
