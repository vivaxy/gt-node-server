/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */
const path = require('path');
const Koa = require('koa');

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

module.exports = async (options) => {
  const koaApp = new Koa();
  const middleware = middlewareNames.map(function(name) {
    return require(path.join('..', 'middleware', name));
  });

  await Promise.all(
    middleware.map(function({ init }) {
      return init(options);
    })
  );
  middleware.forEach(function({ handler }) {
    koaApp.use(handler);
  });

  return koaApp;
};
