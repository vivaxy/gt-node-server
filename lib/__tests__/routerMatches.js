/**
 * @since 20180212 17:23
 * @author vivaxy
 */

const test = require('ava');

const routerMatches = require('../routerMatches.js');

test((t) => {
  t.deepEqual(routerMatches('/demo', '/demo'), {});
  t.deepEqual(routerMatches('/:demo', '/demo'), { demo: 'demo' });
  t.deepEqual(routerMatches('/:demo/index', '/demo/index'), { demo: 'demo' });
  t.deepEqual(routerMatches('/:demo/index', '/demo'), null);
  t.deepEqual(routerMatches('/:demo/index', '/index'), null);
});
