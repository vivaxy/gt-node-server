/**
 * @since 2016-09-08 18:07
 * @author vivaxy
 */
const path = require('path');

const rootPath = path.join(__dirname, '..');
const logDirectory = path.join(rootPath, 'logs');

exports.buildClientFolder = 'build_client';
exports.buildServerFolder = 'build_server';
exports.appFolder = 'app';
exports.actionsFolder = 'actions';
exports.viewsFolder = 'views';
exports.serverClientRouter = '__build';

exports.rootPath = rootPath;
exports.logFile = path.join(logDirectory, 'default.log');
