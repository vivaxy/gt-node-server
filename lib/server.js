/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

const http = require('http');
const Koa = require('koa');

const { port } = require('../conf/server');

const log = require('../middlewares/log');
const router = require('../middlewares/router');
const bodyParser = require('../middlewares/body-parser');

const app = new Koa();
const PORT = Number(process.env.PORT) || port;

app.use(log);
app.use(bodyParser);
app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());
server.listen(PORT);
