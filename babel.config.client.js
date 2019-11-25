/**
 * @since 2019-11-25 03:55
 * @author vivaxy
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['> 1%', 'android >= 4.4', 'iOS >= 9'],
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
};
