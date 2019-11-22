/**
 * @since 2017-01-06 16:37
 * @author vivaxy
 */

(async function() {
  try {
    const { port } = require('./configs/server.js');
    const logger = require('./lib/get_logger.js')('server');

    const koaApp = await require('./lib/server')();
    const PORT = Number(process.env.PORT) || port;
    koaApp.listen(PORT);
    logger.info('Server started on', PORT);
  } catch (ex) {
    console.error(ex.stack);
  }
})();
