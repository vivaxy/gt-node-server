/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */
const path = require('path');
const Koa = require('koa');
const getLogger = require('../lib/get_logger');
const HTTP_STATUS_CODES = require('../configs/http_status_codes');

const logger = getLogger('lib:server');

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
  const koaApp = new Koa();
  const middleware = middlewareNames.map(function(name) {
    return require(path.join('..', 'middleware', name));
  });

  await Promise.all(
    middleware.map(function({ init }) {
      if (init) {
        return init();
      }
    })
  );
  middleware.forEach(function({ handler }) {
    if (handler) {
      koaApp.use(async (ctx, next) => {
        logger.info('middleware  in: ' + handler.name);
        await handler(ctx, next);
        logger.info('middleware out: ' + handler.name);
      });
    }
  });

  return koaApp;
})();
