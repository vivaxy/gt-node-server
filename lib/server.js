/**
 * @since 2016-09-08 18:03
 * @author vivaxy
 */

const Koa = require('koa');

const { port } = require('../conf/server.js');

const log = require('../middlewares/log.js');
const routers = require('../middlewares/routers.js');
const bodyParser = require('../middlewares/bodyParser.js');

const logger = require('../lib/logger.js');

module.exports = async () => {
  const koaApp = new Koa();

  koaApp.use(log);
  koaApp.use(bodyParser);
  koaApp.use(routers);

  const PORT = Number(process.env.PORT) || port;
  koaApp.listen(PORT);
  logger.info('Server started on', PORT);
};
