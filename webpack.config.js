/**
 * @since 2019-11-25 02:35
 * @author vivaxy
 */
const path = require('path');
const glob = require('fast-glob');

async function getEntries() {
  const entries = await glob('**/index.js', {
    cwd: path.join(__dirname, 'client'),
  });
  return entries.reduce(function(ret, ent) {
    return {
      ...ret,
      [path.dirname(ent)]: './' + path.join('client', ent),
    };
  }, {});
}

function getMode() {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  return 'development';
}

module.exports = async function() {
  const entries = await getEntries();
  return {
    mode: getMode(),
    entry: entries,
    output: {
      path: path.join(__dirname, 'build', 'client'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.join(__dirname, 'app'),
            path.join(__dirname, 'client'),
          ],
          loader: 'babel-loader',
          options: {
            configFile: path.join(__dirname, 'babel.config.client.js'),
          },
        },
      ],
    },
  };
};
