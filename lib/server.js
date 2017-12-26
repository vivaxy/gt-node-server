/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

const Koa = require('koa');
const next = require('next');

const { port } = require('../conf/server');

const log = require('../middlewares/log');
const { routerMiddlewareRouters, routerMiddlewareAllowedMethods } = require('../middlewares/router');
const getNextMiddleware = require('../middlewares/next');
const bodyParser = require('../middlewares/body-parser');

module.exports = async() => {
    const dev = process.env.NODE_ENV !== 'production';
    const nextApp = next({ dev });

    await nextApp.prepare();

    const koaApp = new Koa();

    koaApp.use(log);
    koaApp.use(getNextMiddleware(nextApp));
    koaApp.use(bodyParser);
    koaApp.use(routerMiddlewareRouters);
    koaApp.use(routerMiddlewareAllowedMethods);

    const PORT = Number(process.env.PORT) || port;
    koaApp.listen(PORT);
};
