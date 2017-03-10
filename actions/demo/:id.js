/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

const action = async(ctx, next) => {
    ctx.body = {
        code: 0,
        data: {
            body: ctx.request.body,
            query: ctx.query,
            params: ctx.params,
        }
    };
};

const methods = ['get', 'post'];

module.exports = {
    action,
    methods,
};
