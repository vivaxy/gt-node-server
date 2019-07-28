/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */
const Koa = require('koa');

const middleware = [
  require('../middleware/log.js'),
  require('../middleware/body_parser.js'),
  require('../middleware/actions_by_routers.js'),
  require('../middleware/allowed_methods.js'),
  require('../middleware/react_ssr.js'),
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
