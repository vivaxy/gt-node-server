/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const glob = require('fast-glob');
const Router = require('@koa/router');

const getLogger = require('../lib/get_logger');
const ServerError = require('../lib/server_error');
const httpMethods = require('../configs/http_methods');
const httpStatusCodes = require('../configs/http_status_codes');
const { projectBase, nodeServerInner } = require('../configs/paths');

const router = new Router();
const logger = getLogger('middleware:router');
const jsExt = '.js';
const actionsBase = path.join(__dirname, '..', 'actions');

function getRelativePath(absolutePath) {
  return '/' + path.relative(actionsBase, absolutePath).slice(0, -3);
}

function getActionFromAbsolutePath(absolutePath) {
  const relativePath = getRelativePath(absolutePath);
  return {
    relativePath,
    absolutePath,
    module: require(absolutePath),
  };
}

async function getActions() {
  const actionAbsolutePaths = await glob(`${actionsBase}/**/*${jsExt}`, {
    dot: true,
  });

  const actions = actionAbsolutePaths.map(getActionFromAbsolutePath);

  function getParamDepth(action) {
    return action.relativePath.split('/').findIndex((section) => {
      return section.startsWith(':');
    });
  }

  return actions.sort((prev, next) => {
    const prevIndex = getParamDepth(prev);
    const nextIndex = getParamDepth(next);
    if (prevIndex > nextIndex) {
      return -1;
    }
    if (prevIndex < nextIndex) {
      return 1;
    }
    if (prevIndex === -1) {
      return 0;
    }
    throw new Error(
      'Router params conflict: ' + prev.relativePath + ', ' + next.relativePath
    );
  });
}

router.get(`/${nodeServerInner}/react.js`, async (ctx, next) => {
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
  await next();
});
router.get(`/${nodeServerInner}/react-dom.js`, async (ctx, next) => {
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
  await next();
});
router.get(`/${nodeServerInner}/node-server.js`, async (ctx, next) => {
  ctx.body = `// todo previous scripts, get element and container
// ReactDOM.hydrate(element, container);`;
  ctx.set('Content-Type', 'text/javascript');
  await next();
});

function createDefaultRouterHandler({ relativePath, handler }) {
  return async (ctx, next) => {
    ctx.routers = {
      relativePath,
    };
    await next();
    try {
      const body = await handler(ctx);
      ctx.status = httpStatusCodes.OK;
      ctx.body = body;
    } catch (ex) {
      if (ex instanceof ServerError) {
        ctx.status = ex.status;
        ctx.body = ex.message;
        return;
      }
      const status = httpStatusCodes.INTERNAL_SERVER_ERROR;
      ctx.status = status;
      // TODO: render error page
      if (process.env.NODE_ENV === 'production') {
        ctx.body = http.STATUS_CODES[status];
      } else {
        ctx.body = ex.stack;
      }
    }
  };
}

function handleUppercaseExports({ relativePath, module }) {
  const methods = Object.keys(httpMethods);
  methods.forEach((method) => {
    if (module.hasOwnProperty(method)) {
      throw new Error(`Export lowercase method ${method} in ${relativePath}`);
    }
  });
}

function getMountActionPromises({ relativePath, module }) {
  const methods = [
    ...Object.keys(httpMethods).map((method) => method.toLowerCase()),
    'use',
  ];
  handleUppercaseExports({ relativePath, module });
  const validMethods = methods.filter((method) =>
    module.hasOwnProperty(method)
  );
  const validActions = validMethods.map((method) => {
    return {
      method,
      relativePath,
      module,
    };
  });
  return validActions.map(async ({ method, relativePath, module }) => {
    const handler = module[method];
    const routerHandler = createDefaultRouterHandler({
      relativePath,
      handler,
    });
    router[method.toLowerCase()](relativePath, routerHandler);
    logger.info('Mount router', method, relativePath);
  });
}

module.exports = {
  async init() {
    const rawActions = await getActions();
    const mountActionPromises = rawActions.reduce((acc, rawAction) => {
      return [...acc, ...getMountActionPromises(rawAction)];
    }, []);
    await Promise.all(mountActionPromises);
  },
  handler: router.routes(),
  router,
};
