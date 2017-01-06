/**
 * @since 2017-01-06 16:39
 * @author vivaxy
 */

import log4js from 'log4js';
import fse from 'fs-extra';

import log4jsConfig, { logFile } from '../conf/log4js';

fse.ensureFileSync(logFile);

log4js.configure(log4jsConfig);

const logger = log4js.getLogger();

export default logger;
