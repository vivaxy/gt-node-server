/**
 * @since 2016-09-08 18:07
 * @author vivaxy
 */

const path = require('path');

const projectBase = path.join(__dirname, '..');
const logDirectory = path.join(projectBase, 'logs');
const logFile = path.join(logDirectory, 'default.log');

exports.projectBase = projectBase;
exports.logFile = logFile;
