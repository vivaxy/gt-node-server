/**
 * @since 2019-11-25 02:35
 * @author vivaxy
 */
const path = require('path');
const glob = require('fast-glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = require('./configs/paths');
const NODE_ENV = require('./configs/node_env');

async function getEntries() {
  const entries = await glob('**/*.js', {
    cwd: path.join(PATHS.rootPath, PATHS.clientFolder),
  });
  return entries.reduce(function(ret, ent) {
    return {
      ...ret,
      [path.join(path.dirname(ent), path.basename(ent, path.extname(ent)))]:
        './' + path.join(PATHS.clientFolder, ent),
    };
  }, {});
}

function getMode() {
  if (process.env.NODE_ENV === NODE_ENV.PRODUCTION) {
    return NODE_ENV.PRODUCTION;
  }
  return NODE_ENV.DEVELOPMENT;
}

module.exports = async function() {
  const entries = await getEntries();
  return {
    mode: getMode(),
    entry: entries,
    output: {
      path: path.join(PATHS.rootPath, PATHS.buildClientFolder),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.join(PATHS.rootPath, PATHS.appFolder),
            path.join(PATHS.rootPath, PATHS.clientFolder),
          ],
          loader: 'babel-loader',
          options: {
            configFile: path.join(PATHS.rootPath, PATHS.babelConfigClientFile),
          },
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === NODE_ENV.DEVELOPMENT,
              },
            },
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false,
      }),
    ],
  };
};
