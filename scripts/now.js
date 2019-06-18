/**
 * @since 2019-06-18 14:17
 * @author vivaxy
 */

const getKoaApp = require('../lib/server');
const getKoaAppPromise = getKoaApp();

module.exports = async function(ctx, next) {
  const koaApp = await getKoaAppPromise;
  return koaApp.callback(ctx, next);
};
