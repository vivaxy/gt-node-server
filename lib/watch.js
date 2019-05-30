/**
 * @since 2019-05-30 08:07:42
 * @author vivaxy
 */

const chokidar = require('chokidar');

module.exports = function watch(paths, callback) {
  const watcher = chokidar.watch(paths, {
    ignored: /(^|[\/\\])\../,
  });
  ['add', 'change', 'unlink'].forEach((event) => {
    watcher.on(event, (path) => {
      callback(event, path);
    });
  });
};
