/**
 * @since 20180212 17:23
 * @author vivaxy
 */

import pathToRegexp from 'path-to-regexp';

export default (routerPath, requestPath) => {
    if (!routerPath.includes(':')) {
        if (routerPath === requestPath) {
            return {};
        }
        return null;
    }
    const keys = [];
    const re = pathToRegexp(routerPath, keys);
    const results = re.exec(requestPath);
    if (results === null) {
        return null;
    }
    if (results.length <= 1) {
        return null;
    }
    const [all, ...params] = results;
    return params.reduce((param, value, index) => {
        return { ...param, [keys[index].name]: value };
    }, {});
};
