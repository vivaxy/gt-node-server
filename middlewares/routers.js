/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */

import path from 'path';
import globPromise from 'glob-promise';

import logger from '../lib/logger';
import NotFound from '../lib/NotFound';
import routerMatches from '../lib/routerMatches';

const jsExt = '.js';
const relativeActionBase = '../actions';

const loadActionMapFromFile = async () => {
    const actionsBase = path.join(__dirname, relativeActionBase);
    const actions = await globPromise(`${actionsBase}/**/*${jsExt}`, {
        dot: true
    });
    const map = new Map();
    actions.map(absolutePath => {
        const relativePath =
            '/' + path.relative(actionsBase, absolutePath).slice(0, -3);
        map.set(relativePath, absolutePath);
        logger.info('Mount router', relativePath);
    });
    return map;
};

const loadActionsFromFilePromise = loadActionMapFromFile();

const findActionClass = async (requestPath, ctx) => {
    const actions = await loadActionsFromFilePromise;
    const routerPath = Array.from(actions.keys()).find(currentRouterPath => {
        const params = routerMatches(currentRouterPath, requestPath);
        ctx.params = params;
        ctx.request.params = params;
        return params;
    });
    if (!routerPath) {
        return NotFound;
    }
    return (await import(actions.get(routerPath))).default;
};

/**
 * - support restful
 * - support path config
 */
export default async (ctx, next) => {
    const { path: requestPath } = ctx.request;
    const ActionClass = await findActionClass(requestPath, ctx);

    const action = new ActionClass(ctx);
    await action.execute();
    await next();
};
