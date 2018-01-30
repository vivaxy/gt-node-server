/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

const Koa = require('koa');

const { port } = require('../conf/server');

const log = require('../middlewares/log');
const {
    routerMiddlewareRouters,
    routerMiddlewareAllowedMethods
} = require('../middlewares/router');
const bodyParser = require('../middlewares/body-parser');

module.exports = async () => {
    const koaApp = new Koa();

    koaApp.use(log);
    koaApp.use(bodyParser);
    koaApp.use(routerMiddlewareRouters);
    koaApp.use(routerMiddlewareAllowedMethods);

    const PORT = Number(process.env.PORT) || port;
    koaApp.listen(PORT);
};
