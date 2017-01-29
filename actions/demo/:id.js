/**
 * @since 2017-01-28 19:25
 * @author vivaxy
 */

export default async(ctx, next) => {
    ctx.body = {
        code: 0,
        data: {
            body: ctx.request.body,
            query: ctx.query,
            params: ctx.params,
        }
    };
};

export const methods = ['get', 'post'];
