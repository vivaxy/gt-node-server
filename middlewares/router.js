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
const relativeActionBase = '../actions';

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

const getActionFromFile = actionPath => {
    const Action = require(`${relativeActionBase}/${actionPath}`);
    const routerPath = `/${actionPath}`;
    const middleware = async (ctx, next) => {
        const act = new Action(ctx);
        await act.execute();
        await next();
    };
    const methods = Action.methods;
    return {
        routerPath: routerPath,
        middleware,
        methods
    };
};

const getConfigPathFromAbsoluteActionFilePath = absoluteActionPath => {
    const actionsBase = path.join(__dirname, relativeActionBase);
    const relativeRouterPath = path.relative(actionsBase, absoluteActionPath);
    const routerPathDirName = path.dirname(relativeRouterPath);
    const routerPathBasename = path.basename(relativeRouterPath, jsExt);
    return path.join(routerPathDirName, routerPathBasename);
};

const addActionsIntoRouter = () => {
    const actionsPaths = getActionFiles();
    return actionsPaths.map(actionPath => {
        const configPath = getConfigPathFromAbsoluteActionFilePath(actionPath);
        const { routerPath, middleware, methods } = getActionFromFile(
            configPath
        );
        methods.forEach(method => {
            logger.debug(
                `[mount router] ${rightPad(
                    method.toUpperCase(),
                    7
                )} ${routerPath}`
            );
            router[method.toLowerCase()](routerPath, middleware);
        });
        return {
            routerPath,
            middleware,
            methods
        };
    });
};

exports.actions = addActionsIntoRouter();
exports.routerMiddlewareRouters = router.routes();
exports.routerMiddlewareAllowedMethods = router.allowedMethods();
