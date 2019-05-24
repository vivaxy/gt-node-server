/**
 * @since 2017-01-06 16:37
 * @author vivaxy
 */

(async () => {
  try {
    await require('./lib/server')();
  } catch (ex) {
    console.error(ex);
  }
})();
