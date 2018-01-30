/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */

const http = require('http');
const path = require('path');
const glob = require('glob');

const Action = require('../lib/Action');
const httpStatusCodes = require('../conf/httpStatusCodes');

/**
 *  - map
 *      - (:)pathSection: map
 *          - ...
 *      - (:)pathSection: class
 */
const routerConfigs = new Map();

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

class NotFound extends Action {
    constructor(ctx) {
        super(ctx);
    }

    execute() {
        this.setState(httpStatusCodes.NOT_FOUND);
        this.setBody(http.STATUS_CODES[httpStatusCodes.NOT_FOUND]);
    }
}

const traverseConfigs = (
    validConfigs,
    requestPathSections,
    depth,
    matchedRouters
) => {
    const nextValidConfigs = [];
    const nextMatchedRouters = [];
    return traverseConfigs(
        nextValidConfigs,
        requestPathSections,
        depth + 1,
        nextMatchedRouters
    );
};

/**
 * - support restful
 * - support path config
 */
module.exports = async (ctx, next) => {
    const { path: requestPath } = ctx.request;
    const ActionClass = requestPath.split('/').reduce(
        (results, pathSection) => {
            if (!results.length) {
                return NotFound;
            }
            return results.reduce((acc, result) => {
                if (!result.get) {
                    return acc;
                }
                result.keys().reduce((res, key) => {
                    if (key.startsWith(':')) {
                        return [...res, result.get(key)];
                    }
                    return res;
                }, []);
                const nextConfig = result.get(pathSection);
                if (nextConfig) {
                    return [...acc, nextConfig];
                }
            }, []);
        },
        [routerConfigs]
    );

    const action = new ActionClass(ctx);
    await action.execute();
    await next();
};
