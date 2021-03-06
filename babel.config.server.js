/**
 * @since 2019-12-21 07:50
 * @author vivaxy
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'babel-plugin-dynamic-import-node',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    [
      'babel-plugin-transform-require-ignore',
      {
        extensions: ['.css'],
      },
    ],
  ],
};
