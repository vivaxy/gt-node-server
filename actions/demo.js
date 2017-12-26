/**
 * @since 2017-01-29 11:07
 * @author vivaxy
 */

const alphabet = 'abcdefghijklmnopqrstvuwxyz';
exports.action = async(ctx, next) => {
    ctx.body = {
        code: 200,
        list: alphabet.split(''),
    };
};

exports.methods = ['GET', 'POST'];
