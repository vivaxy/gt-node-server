/**
 * @since 2019-05-18 16:46:19
 * @author vivaxy
 */

const test = require('ava');
const getPathSections = require('../getPathSections.js');

test('normalize multiple slashes', function(t) {
  t.deepEqual(getPathSections('//'), []);
  t.deepEqual(getPathSections('/a//b'), ['a', 'b']);
  t.deepEqual(getPathSections('/a//'), ['a']);
});
