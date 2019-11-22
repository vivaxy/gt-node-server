/**
 * @since 2019-05-25 16:52:56
 * @author vivaxy
 */
exports.get = async function get(ctx) {
  return ctx.renderEJS({
    title: 'Render EJS',
    name: 'vivaxy',
    age: 18,
  });
};
