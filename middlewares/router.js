/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */

import Router from 'koa-router';

import routerConfigs from '../router';
import bodyParser from './body-parser';

const router = new Router();

Object.keys(routerConfigs).forEach((path) => {
    const methods = routerConfigs[path];
    methods.forEach((method) => {
        router[method](path, bodyParser, async(ctx, next) => {
            require(`../actions${path}`).default(ctx, next);
        });
    });
});

export default router;
