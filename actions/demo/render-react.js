/**
 * @since 2019-11-22 09:33
 * @author vivaxy
 */
exports.get = async function get(ctx) {
  return ctx.renderReact({
    title: 'Title',
  });
};
