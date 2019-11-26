/**
 * @since 2016-09-08 18:07
 * @author vivaxy
 */

const path = require('path');

const projectBase = path.join(__dirname, '..');
const logDirectory = path.join(projectBase, 'logs');

exports.projectBase = projectBase;
exports.logFile = path.join(logDirectory, 'default.log');
