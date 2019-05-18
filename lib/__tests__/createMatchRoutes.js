/**
 * @since 2019-03-18 16:16:14
 * @author vivaxy
 */

const test = require('ava');
const errors = require('../../conf/errors.js');
const createMatchRoutes = require('../createMatchRoutes.js');

test('basic action paths 1', function(t) {
  const matchRoute = createMatchRoutes(['/a']);
  t.deepEqual(matchRoute('/a'), { actionPath: '/a', params: {} });
});

test('basic action paths 2', function(t) {
  const pathToAction = createMatchRoutes(['/a/b']);
  t.deepEqual(pathToAction('/a/b'), { actionPath: '/a/b', params: {} });
});

test('basic action paths 3', function(t) {
  const pathToAction = createMatchRoutes(['/a']);
  t.throws(() => {
    pathToAction('/b');
  });
});

test('basic action paths 4', function(t) {
  const pathToAction = createMatchRoutes(['/a', '/b']);
  t.deepEqual(pathToAction('/b'), { actionPath: '/b', params: {} });
});

test('basic action paths 5', function(t) {
  const pathToAction = createMatchRoutes(['/a/:name', '/a']);
  t.deepEqual(pathToAction('/a/b'), {
    actionPath: '/a/:name',
    params: { name: 'b' },
  });
});

test('basic action paths 6', function(t) {
  const pathToAction = createMatchRoutes(['/a/:name', '/a']);
  t.deepEqual(pathToAction('/a'), {
    actionPath: '/a',
    params: {},
  });
});

test('basic action paths 7', function(t) {
  const pathToAction = createMatchRoutes(['/a']);
  t.throws(() => {
    pathToAction('');
  }, errors.CANNOT_FIND_ACTION_PATH);
});
