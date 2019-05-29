/**
 * @since 2019-05-25 16:52:56
 * @author vivaxy
 */
exports.get = async function get({ render }) {
  return render({
    name: 'vivaxy',
    age: 18,
  });
};
