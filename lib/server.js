/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */
const Koa = require('koa');

const middleware = [
  require('../middleware/log'),
  require('../middleware/body_parser'),
  require('../middleware/allowed_methods'),
  require('../middleware/server_error'),
  require('../middleware/routers'),
  require('../middleware/args'),
  require('../middleware/logger'),
  require('../middleware/render_ejs'),
  require('../middleware/react_ssr'),
];

module.exports = async (options) => {
  const koaApp = new Koa();

  await Promise.all(
    middleware.map(({ init }) => {
      return init(options);
    })
  );
  middleware.forEach(({ handler }) => {
    koaApp.use(handler);
  });

  return koaApp;
};
