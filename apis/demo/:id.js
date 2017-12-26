/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

exports.action = async(ctx, next) => {
    ctx.body = {
        code: 0,
        data: {
            body: ctx.request.body,
            query: ctx.query,
            params: ctx.params,
        }
    };
};

exports.methods = ['GET', 'POST'];
