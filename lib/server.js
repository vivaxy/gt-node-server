/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

const Koa = require('koa');

const { port } = require('../conf/server');

const log = require('../middlewares/log');
const routers = require('../middlewares/routers');
const bodyParser = require('../middlewares/body-parser');

module.exports = async () => {
    const koaApp = new Koa();

    koaApp.use(log);
    koaApp.use(bodyParser);
    koaApp.use(routers);

    const PORT = Number(process.env.PORT) || port;
    koaApp.listen(PORT);
};
