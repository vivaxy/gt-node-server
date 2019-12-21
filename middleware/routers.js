/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */
const path = require('path');
const glob = require('fast-glob');
const Router = require('@koa/router');

const getLogger = require('../lib/get_logger');
const HTTP_METHODS = require('../configs/http_methods');
const HTTP_STATUS_CODES = require('../configs/http_status_codes');

const router = new Router();
const logger = getLogger('middleware:routers');
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

function handleUppercaseExports({ relativePath, module }) {
  const methods = Object.keys(HTTP_METHODS);
  methods.forEach((method) => {
    if (module.hasOwnProperty(method)) {
      throw new Error(`Export lowercase method ${method} in ${relativePath}`);
    }
  });
}

function getMountActionPromises({ relativePath, module }) {
  const methods = [
    ...Object.keys(HTTP_METHODS).map((method) => method.toLowerCase()),
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
    const routerHandler = async function(ctx, next) {
      // run other middleware first
      await next();
      if (ctx.status !== HTTP_STATUS_CODES.NOT_FOUND) {
        // should not handle
        return;
      }
      const body = await handler(ctx);
      ctx.body = body;
    };
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
