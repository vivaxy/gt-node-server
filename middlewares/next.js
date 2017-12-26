/**
 * @since 20171226 17:30
 * @author vivaxy
 */

const { parse } = require('url');
const { routerMatch } = require('../middlewares/router');

module.exports = (nextApp) => {
    const handle = nextApp.getRequestHandler();
    return async(ctx, next) => {
        const parsedUrl = parse(ctx.url, true);

        if (routerMatch(ctx.path, ctx.method).route) {
            return await next();
        }
        // return await nextApp.render(ctx.req, ctx.res, ctx.path, ctx.query, parsedUrl);
        return await handle(ctx.req, ctx.res, parsedUrl);
    };
};
