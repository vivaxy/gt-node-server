/**
 * @since 2017-01-06 16:39
 * @author vivaxy
 */

import log4js from 'log4js';
import fse from 'fs-extra';

import { logFile } from '../conf/paths';
import log4jsConfig from '../conf/log4js';

fse.ensureFileSync(logFile);
log4js.configure(log4jsConfig);
export default log4js.getLogger();
