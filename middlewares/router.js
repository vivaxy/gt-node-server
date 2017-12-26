/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */

const path = require('path');
const glob = require('glob');
const Router = require('koa-router');

const logger = require('../lib/logger');

const router = new Router();

const jsExt = '.js';
const relativeActionBase = '../apis';

const rightPad = (string, count) => {
    while (string.length < count) {
        string = string + ' ';
    }
    return string;
};

const getActionFiles = () => {
    const actionsBase = path.join(__dirname, relativeActionBase);
    return glob.sync(`${actionsBase}/**/*${jsExt}`, { dot: true });
};

const getConfigFromFile = (configPath) => {
    const configs = require(`${relativeActionBase}/${configPath}`);
    const routerPath = `/${configPath}`;
    const middleware = configs.action;
    const methods = configs.methods || ['GET'];
    return {
        routerPath: routerPath,
        middleware,
        methods,
    };
};

const getConfigPathFromAbsoluteActionFilePath = (absoluteActionPath) => {
    const actionsBase = path.join(__dirname, relativeActionBase);
    const relativeRouterPath = path.relative(actionsBase, absoluteActionPath);
    const routerPathDirName = path.dirname(relativeRouterPath);
    const routerPathBasename = path.basename(relativeRouterPath, jsExt);
    return path.join(routerPathDirName, routerPathBasename);
};

const addActionsIntoRouter = () => {
    const actionsPaths = getActionFiles();
    return actionsPaths.map((actionPath) => {
        const configPath = getConfigPathFromAbsoluteActionFilePath(actionPath);
        const {
            routerPath,
            middleware,
            methods,
        } = getConfigFromFile(configPath);
        methods.forEach((method) => {
            logger.debug(`[mount router] ${rightPad(method.toUpperCase(), 7)} ${routerPath}`);
            router[method.toLowerCase()](routerPath, middleware);
        });
        return {
            routerPath,
            middleware,
            methods,
        };
    });
};

exports.actions = addActionsIntoRouter();
exports.routerMiddlewareRouters = router.routes();
exports.routerMiddlewareAllowedMethods = router.allowedMethods();
exports.routerMatch = router.match.bind(router);
