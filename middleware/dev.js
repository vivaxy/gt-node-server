/**
 * @since 2019-12-21 07:51
 * @author vivaxy
 */
const path = require('path');
const fse = require('fs-extra');
const glob = require('fast-glob');
const webpack = require('webpack');
const babel = require('@babel/core');
const e2k = require('express-to-koa');
const createWebpackDevMiddleware = require('webpack-dev-middleware');

const watch = require('../lib/watch');
const paths = require('../configs/paths');
const getLogger = require('../lib/get_logger');
const webpackConfig = require('../webpack.config');

const logger = getLogger('middleware:dev');

const buildStatus = {
  server: {},
  client: {},
};

const appPath = path.join(paths.rootPath, paths.appFolder);
const buildServerPath = path.join(paths.rootPath, paths.buildServerFolder);
const buildClientPath = path.join(paths.rootPath, paths.buildClientFolder);

function babelTransform(code) {
  return new Promise(function(resolve, reject) {
    babel.transform(
      code,
      {
        root: paths.rootPath,
        configFile: './babel.config.server.js',
        sourceMaps: true,
      },
      function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        const { code, map } = result;
        resolve({ code, sourcemap: map });
      }
    );
  });
}

const buildServer = wrapBuildStatus('server', async function buildServer(
  filePath
) {
  if (path.extname(filePath) !== '.js') {
    // ignore
    return;
  }
  const filename = path.basename(filePath);
  const fullFilePath = path.join(appPath, filePath);
  const outFullFilePath = path.join(buildServerPath, filePath);
  const outSourcemapFilePath = outFullFilePath + '.map';
  const sourceCode = await fse.readFile(fullFilePath, 'utf8');
  const { code, sourcemap } = await babelTransform(sourceCode);
  await fse.outputFile(
    outFullFilePath,
    `${code}
// sourceMappingURL=${filename}.map`
  );
  await fse.outputFile(outSourcemapFilePath, sourcemap);
});

function wrapBuildStatus(type, fn) {
  return function(filePath) {
    function cleanBuildStatus() {
      buildStatus[type][filePath] = null;
    }
    return new Promise(function(resolve, reject) {
      if (!buildStatus[type][filePath]) {
        buildStatus[type][filePath] = {};
      }
      buildStatus[type][filePath].resolve = resolve;
      buildStatus[type][filePath].reject = reject;
      const promise = fn(filePath);
      buildStatus[type][filePath].promise = promise;
      promise
        .then(function(data) {
          if (resolve === buildStatus[type][filePath].resolve) {
            cleanBuildStatus();
            resolve(data);
          }
        })
        .catch(function(reason) {
          if (reject === buildStatus[type][filePath].reject) {
            cleanBuildStatus();
            reject(reason);
          }
        });
    });
  };
}

module.exports = {
  init: async function() {
    logger.info('build server started');
    await fse.remove(buildServerPath);
    const appFiles = await glob('**/*', { cwd: appPath });
    // build server by babel
    await Promise.all(appFiles.map(buildServer));
    logger.info('build server finished');
    // watch for changes
    watch(appPath, async function(event, fullFilePath) {
      delete require.cache[fullFilePath];
      const filePath = path.relative(appPath, fullFilePath);
      logger.info('build server started');
      await buildServer(filePath);
      logger.info('build server finished');
    });

    // build client by webpack
    await fse.remove(buildClientPath);
    const compiler = webpack(await webpackConfig());
    this.handler = e2k(
      createWebpackDevMiddleware(compiler, {
        publicPath: '/' + paths.serverClientRouter + '/',
        hot: true,
      })
    );
  },
};
