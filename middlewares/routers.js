/**
 * @since 2017-01-28 19:02
 * @author vivaxy
 */

const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const Router = require('koa-router');

const ArgTypes = require('../lib/ArgTypes.js');
const getLogger = require('../lib/getLogger.js');
const ServerError = require('../lib/ServerError.js');
const httpMethods = require('../configs/httpMethods.js');
const { projectBase, nodeServerInner } = require('../configs/paths.js');
const httpStatusCodes = require('../configs/httpStatusCodes.js');

const router = new Router();
const logger = getLogger('middleware:router');

async function getActions() {
  const actionsBase = path.join(__dirname, '..', 'actions');
  const jsExt = '.js';

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

function render(args) {
  return `<html>
  <title>Render</title>
  <body>
    <pre>${JSON.stringify(args, null, 2)}</pre>
  </body>
  </html>`;
}

function createDefaultRouterHandler({
  relativePath,
  handler,
  argTypes,
  defaultArgs = {},
}) {
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
        logger: getLogger(relativePath),
        render,
        ServerError,
        ArgTypes,
        ctx,
      });
      ctx.status = httpStatusCodes.OK;
      ctx.body = body;
      return;
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

module.exports = {
  async init() {
    const actions = await getActions();
    actions.forEach(({ module, relativePath }) => {
      Object.keys(httpMethods)
        .concat(Object.keys(httpMethods).map((method) => method.toLowerCase()))
        .concat('use')
        .forEach((method) => {
          const handler = module[method];
          if (handler) {
            router[method.toLowerCase()](
              relativePath,
              createDefaultRouterHandler({
                relativePath,
                handler,
                argTypes: module.argTypes,
                defaultArgs: module.defaultArgs,
              })
            );
            logger.info('Mount router', method, relativePath);
          }
        });
    });
  },
  middleware: router.routes(),
  router,
};
