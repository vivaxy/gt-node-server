/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

const Koa = require('koa');

const { port } = require('../configs/server.js');

const middleware = [
  require('../middleware/log.js'),
  require('../middleware/body_parser.js'),
  require('../middleware/routers.js'),
  require('../middleware/allowed_methods.js'),
];
const logger = require('./get_logger.js')('server');

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

  const PORT = Number(process.env.PORT) || port;
  koaApp.listen(PORT);
  logger.info('Server started on', PORT);
};
