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
const httpMethods = require('../configs/httpMethods.js');
const { projectBase, nodeServerInner } = require('../configs/paths.js');
const httpStatusCodes = require('../configs/httpStatusCodes.js');

const router = new Router();
const logger = getLogger('middleware:router');

async function getActions() {
  const actionsBase = path.join(__dirname, '..', 'actions');
  const jsExt = '.js';
  const actions = await glob(`${actionsBase}/**/*${jsExt}`, {
    dot: true,
  });
  return actions.map((absolutePath) => {
    const relativePath =
      '/' + path.relative(actionsBase, absolutePath).slice(0, -3);
    return {
      relativePath,
      absolutePath,
      module: require(absolutePath),
    };
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
  return async (ctx, next) => {
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
      const response = await handler({
        ctx,
        httpMethods,
        httpStatusCodes,
        render,
        logger: getLogger(relativePath),
        args: ArgTypes.merge(args, defaultArgs),
        ArgTypes,
      });
      ctx.status = response.status || httpStatusCodes.OK;
      ctx.body = response.body;
    } catch (ex) {
      ctx.status = httpStatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = ex.message;
    }
    await next();
  };
}

module.exports = {
  async init() {
    const actions = await getActions();
    actions.forEach(({ module, relativePath }) => {
      Object.keys(httpMethods)
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
