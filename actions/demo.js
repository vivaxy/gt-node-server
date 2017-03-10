/**
 * @since 2017-01-29 11:07
 * @author vivaxy
 */

const action = async(ctx, next) => {
    ctx.body = {
        code: 0
    };
};

const methods = ['get', 'post'];

module.exports = {
    action,
    methods,
};
