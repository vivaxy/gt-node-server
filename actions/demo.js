/**
 * @since 2017-01-29 11:07
 * @author vivaxy
 */

export default async(ctx, next) => {
    ctx.body = {
        code: 0
    };
};

export const methods = ['get', 'post'];
