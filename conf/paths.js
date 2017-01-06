/**
 * @since 2016-09-08 18:07
 * @author vivaxy
 */

import path from 'path';

import pkg from '../package.json';

export const log = path.join(`${process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE}`, `${pkg.name}-logs`);
