/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

const Koa = require('koa');

const middleware = [
  require('../middleware/log.js'),
  require('../middleware/body_parser.js'),
  require('../middleware/routers.js'),
  require('../middleware/allowed_methods.js'),
];

module.exports = async () => {
  const koaApp = new Koa();

  await Promise.all(
    middleware.map(({ init }) => {
      return init();
    })
  );
  middleware.forEach(({ handler }) => {
    koaApp.use(handler);
  });

  return koaApp;
};
