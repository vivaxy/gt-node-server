/**
 * @since 2016-09-08 18:07
 * @author vivaxy
 */

import path from 'path';

export const projectBase = path.join(__dirname, '..');
const logDirectory = path.join(projectBase, 'logs');
export const logFile = path.join(logDirectory, 'default.log');
export const nodeServerInner = '__node-server';
