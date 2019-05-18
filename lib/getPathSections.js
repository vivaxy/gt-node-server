/**
 * @since 2019-05-18 16:45:39
 * @author vivaxy
 */

module.exports = function getPathSections(requestPath) {
  const path = require('path');
  let normalizedPath = path.normalize(requestPath);
  if (normalizedPath.startsWith('/')) {
    normalizedPath = normalizedPath.slice(1);
  }
  if (normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  if (normalizedPath === '') {
    return [];
  }
  return normalizedPath.split('/');
};
