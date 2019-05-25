/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const glob = require('fast-glob');
const Router = require('koa-router');

const ArgTypes = require('../lib/arg_types.js');
const getLogger = require('../lib/get_logger.js');
const ServerError = require('../lib/server_error.js');
const httpMethods = require('../configs/http_methods.js');
const { projectBase, nodeServerInner } = require('../configs/paths.js');
const httpStatusCodes = require('../configs/http_status_codes.js');

const router = new Router();
const logger = getLogger('middleware:router');
const jsExt = '.js';

async function getActions() {
  const actionsBase = path.join(__dirname, '..', 'actions');

  const actionAbsolutePaths = await glob(`${actionsBase}/**/*${jsExt}`, {
    dot: true,
  });

  const actions = actionAbsolutePaths.map((absolutePath) => {
    const relativePath =
      '/' + path.relative(actionsBase, absolutePath).slice(0, -3);
    return {
      relativePath,
      absolutePath,
      module: require(absolutePath),
    };
  });

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

function getArgs(ctx) {
  switch (ctx.request.method) {
    case httpMethods.GET:
      return { ...ctx.request.query, ...ctx.request.params };
    case httpMethods.POST:
      return { ...ctx.request.params, ...ctx.request.body };
  }
}

function checkFileExists(p) {
  return new Promise((resolve) => {
    fs.access(p, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
}

async function getRender(relativePath) {
  const pageRendererFile = path.join(
    __dirname,
    '..',
    'pages',
    relativePath + jsExt
  );
  const fileExists = await checkFileExists(pageRendererFile);
  if (fileExists) {
    return require(pageRendererFile);
  }
  return () => {
    throw new Error('Missing page for: ' + relativePath);
  };
}

async function createDefaultRouterHandler({
  relativePath,
  handler,
  argTypes,
  defaultArgs = {},
}) {
  const logger = getLogger(relativePath);
  const render = await getRender(relativePath);

  return async (ctx) => {
    const args = getArgs(ctx);
    if (argTypes) {
      try {
        ArgTypes.check(argTypes, args);
      } catch (ex) {
        ctx.status = httpStatusCodes.BAD_REQUEST;
        ctx.body = ex.message;
        return;
      }
    }
    try {
      const body = await handler({
        args: ArgTypes.merge(args, defaultArgs),
        logger,
        render,
        ServerError,
        ArgTypes,
        ctx,
      });
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
      // todo render error page
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

module.exports = {
  async init() {
    const rawActions = await getActions();
    const methods = [
      ...Object.keys(httpMethods).map((method) => method.toLowerCase()),
      'use',
    ];
    const actions = rawActions.reduce((acc, { module, relativePath }) => {
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
      return [...acc, ...validActions];
    }, []);
    await Promise.all(
      actions.map(({ method, relativePath, module }) => {
        return (async () => {
          const handler = module[method];
          const routerHandler = await createDefaultRouterHandler({
            relativePath,
            handler,
            argTypes: module.argTypes,
            defaultArgs: module.defaultArgs,
          });
          router[method.toLowerCase()](relativePath, routerHandler);
          logger.info('Mount router', method, relativePath);
        })();
      })
    );
  },
  handler: router.routes(),
  router,
};
