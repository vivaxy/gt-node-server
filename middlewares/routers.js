/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */

import fs from 'fs';
import path from 'path';
import globPromise from 'glob-promise';

import logger from '../lib/logger';
import NotFound from '../lib/NotFound';
import routerMatches from '../lib/routerMatches';
import { projectBase, nodeServerInner } from '../conf/paths';

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

const handleInnerActions = async ctx => {
    const { path: requestPath } = ctx.request;
    if (requestPath === `/${nodeServerInner}/react.js`) {
        ctx.body = fs.createReadStream(
            path.join(
                projectBase,
                'node_modules',
                'react',
                'umd',
                process.env.NODE_ENV === 'production'
                    ? 'react.production.min.js'
                    : 'react.development.js'
            )
        );
        ctx.set('Content-Type', 'text/javascript');
    }
    if (requestPath === `/${nodeServerInner}/react-dom.js`) {
        ctx.body = fs.createReadStream(
            path.join(
                projectBase,
                'node_modules',
                'react-dom',
                'umd',
                process.env.NODE_ENV === 'production'
                    ? 'react-dom.production.min.js'
                    : 'react-dom.development.js'
            )
        );
        ctx.set('Content-Type', 'text/javascript');
    }
    // todo
    if (requestPath === `/${nodeServerInner}/node-server.js`) {
        ctx.body = `// todo previous scripts, get element and container
// ReactDOM.hydrate(element, container);`;
        ctx.set('Content-Type', 'text/javascript');
    }
    // todo bundle scripts
};

/**
 * - support restful
 * - support path config
 */
export default async (ctx, next) => {
    const { path: requestPath } = ctx.request;
    if (requestPath.startsWith(`/${nodeServerInner}`)) {
        await handleInnerActions(ctx);
    } else {
        const ActionClass = await findActionClass(requestPath, ctx);
        const action = new ActionClass(ctx);
        await action.execute();
    }
    await next();
};
