/*eslint-disable*/
const merge = require('webpack-merge');
const common = require('./__config/webpack.common');
const path = require('path');

const config = merge(common('development'), {
  devtool: 'eval',
  devServer: {
    contentBase: path.join(__dirname, '__build'),
    port: 8080,
    open: true,
    historyApiFallback: true,
    // useLocalIp: true,
    // host: '10.192.130.190',
    stats: 'minimal'
  },
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000
  }
});

module.exports = config;
