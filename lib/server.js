/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

const Koa = require('koa');

const { port } = require('../configs/server.js');

const middlewares = [
  require('../middlewares/log.js'),
  require('../middlewares/bodyParser.js'),
  require('../middlewares/routers.js'),
  require('../middlewares/allowedMethods.js'),
];
const logger = require('./getLogger.js')('server');

module.exports = async () => {
  const koaApp = new Koa();

  await Promise.all(
    middlewares.map(({ init }) => {
      return init();
    })
  );
  middlewares.forEach(({ middleware }) => {
    koaApp.use(middleware);
  });

  const PORT = Number(process.env.PORT) || port;
  koaApp.listen(PORT);
  logger.info('Server started on', PORT);
};
