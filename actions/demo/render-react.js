/**
 * @since 2019-11-22 09:33
 * @author vivaxy
 */
exports.get = async function get(ctx) {
  return await ctx.renderReact({
    title: 'Render React Demo',
    __ssr: ctx.args.ssr,
  });
};
