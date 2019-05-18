/**
 * @since 2017-01-06 16:39
 * @author vivaxy
 */

const log4js = require('log4js');
const fse = require('fs-extra');

const { logFile } = require('../conf/paths.js');
const log4jsConfig = require('../conf/log4js.js');

fse.ensureFileSync(logFile);
log4js.configure(log4jsConfig);
module.exports = log4js;
