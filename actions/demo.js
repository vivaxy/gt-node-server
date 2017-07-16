/**
 * @since 2017-01-29 11:07
 * @author vivaxy
 */

exports.action = async(ctx, next) => {
    ctx.body = {
        code: 0
    };
};

exports.methods = ['GET', 'POST'];
