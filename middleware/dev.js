/**
 * @since 2019-12-21 07:51
 * @author vivaxy
 */
const path = require('path');
const fse = require('fs-extra');
const glob = require('fast-glob');
const webpack = require('webpack');
const babel = require('@babel/core');
const createWebpackDevMiddleware = require('webpack-dev-middleware');

const watch = require('../lib/watch');

const buildStatus = {
  server: {},
  client: {},
};

const rootPath = path.join(__dirname, '..');
const appPath = path.join(rootPath, 'app');
const buildServerPath = path.join(rootPath, 'build_server');

let webpackDevMiddleware = null;
function babelTransform(code) {
  return new Promise(function(resolve, reject) {
    babel.transform(
      code,
      {
        root: rootPath,
        configFile: 'babel.config.server.js',
      },
      function(err, result) {
        if (err) {
          reject(err);
        }
        const { code, map } = result;
        resolve({ code, sourcemap: map });
      }
    );
  });
}

async function buildServer(filePath) {
  if (path.extname(filePath) !== '.js') {
    // ignore
    return;
  }
  const filename = path.basename(filePath);
  const fullFilePath = path.join(appBase, filePath);
  const outFullFilePath = path.join(buildServerPath, filePath);
  const outSourcemapFilePath = outFullFilePath + '.map';
  const sourceCode = await fse.readFile(fullFilePath, 'utf8');
  const { code, sourcemap } = await babelTransform(sourceCode);
  await fse.writeFile(
    outFullFilePath,
    `${code}
// sourceMappingURL=${filename}.map`
  );
  await fse.writeFile(outSourcemapFilePath, sourcemap);
}

function wrapBuildStatus(type, fn) {
  return function(filePath) {
    return new Promise(function(resolve, reject) {
      const buildPromise = fn(filePath);
      buildStatus[type][filePath] = buildPromise;
      buildPromise;
    });
  };
}

module.exports = {
  init: async function() {
    const appFiles = await glob('**/*', { cwd: appBase });
    // build server by babel
    await Promise.all(appFiles.map(buildServer));
    // watch for changes
    watch(appBase, async function(event, filePath) {
      await buildServer(filePath);
    });

    // build client by webpack
    const compiler = webpack();
    webpackDevMiddleware = createWebpackDevMiddleware(compiler);

    // watch for changes
  },
  handler: async function(ctx, next) {
    await webpackDevMiddleware(ctx.request, ctx.response, next);
  },
};
