/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

import http from 'http';
import Koa from 'koa';

import { port } from '../conf/server';

import log from '../middlewares/log';
import router from '../middlewares/router';
import bodyParser from '../middlewares/body-parser';

const app = new Koa();
const PORT = Number(process.env.PORT) || port;

app.use(log);
app.use(bodyParser);
app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());
server.listen(PORT);
