/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

import Koa from 'koa';

import { port } from '../conf/server';

import log from '../middlewares/log';
import routers from '../middlewares/routers';
import bodyParser from '../middlewares/body-parser';

import logger from '../lib/logger';

export default async () => {
  const koaApp = new Koa();

  koaApp.use(log);
  koaApp.use(bodyParser);
  koaApp.use(routers);

  const PORT = Number(process.env.PORT) || port;
  koaApp.listen(PORT);
  logger.info('Server started on', PORT);
};
