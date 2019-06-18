/**
 * @since 2017-01-06 16:39
 * @author vivaxy
 */

const log4js = require('log4js');
const fse = require('fs-extra');

const { logFile } = require('../configs/paths.js');
const log4jsConfig = require('../configs/log4js.js');

if (!process.env.DISABLE_FS) {
  fse.ensureFileSync(logFile);
} else {
  delete log4jsConfig.appenders.dateFile;
  delete log4jsConfig.appenders.logLevelFilter;
  log4jsConfig.categories.default.appenders = log4jsConfig.categories.default.appenders.slice(
    0,
    1
  );
}

log4js.configure(log4jsConfig);
module.exports = log4js.getLogger;
