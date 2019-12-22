/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */
const path = require('path');
const Koa = require('koa');
const getLogger = require('../lib/get_logger');

const logger = getLogger('lib:server');
const NODE_ENV_DEVELOPMENT = 'development';

const middlewareNames = [
  'app_logger',
  'server_error',
  'body_parser',
  'allowed_methods',
  'routers',
  'logger',
  'args',
  'render_ejs',
  'render_react',
];

module.exports = (async function createApp() {
  process.on('unhandledrejection', function(error) {
    logger.error(error.stack);
    process.exit(1);
  });

  const koaApp = new Koa();
  const middleware = middlewareNames.map(function(name) {
    return require(path.join('..', 'middleware', name));
  });

  if (process.env.NODE_ENV === NODE_ENV_DEVELOPMENT) {
    await require('../middleware/dev').init();
  }
  try {
    await Promise.all(
      middleware.map(function({ init }) {
        if (init) {
          return init();
        }
      })
    );
  } catch (ex) {
    logger.error(ex.stack);
    process.exit(1);
  }
  middleware.forEach(function({ handler }) {
    if (handler) {
      koaApp.use(async (ctx, next) => {
        // logger.debug('middleware  in: ' + handler.name);
        await handler(ctx, next);
        // logger.debug('middleware out: ' + handler.name);
      });
    }
  });
  if (process.env.NODE_ENV === NODE_ENV_DEVELOPMENT) {
    koaApp.use(require('../middleware/dev').handler);
  }

  return koaApp;
})();
