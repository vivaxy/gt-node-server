/**
 * @since 2017-01-06 16:39
 * @author vivaxy
 */
const log4js = require('log4js');
const fse = require('fs-extra');

const paths = require('../configs/paths');
const log4jsConfig = require('../configs/log4js');

fse.ensureFileSync(paths.logFile);

log4js.configure(log4jsConfig);
module.exports = log4js.getLogger;
