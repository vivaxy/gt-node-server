/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

import http from 'http';
import Koa from 'koa';

import { port } from '../conf/server';

import log from '../middlewares/log';

const app = new Koa();
const PORT = Number(process.env.PORT) || port;

app.use(log);

const server = http.createServer(app.callback());
server.listen(PORT);
