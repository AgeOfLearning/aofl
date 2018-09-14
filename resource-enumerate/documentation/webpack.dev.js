/*eslint-disable*/
const merge = require('webpack-merge');
const common = require('./__config/webpack.common');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = merge(common('development'), {
  devtool: 'eval',
  devServer: {
    contentBase: path.join(__dirname, '__build'),
    port: 8080,
    open: true,
    historyApiFallback: true,
    // useLocalIp: true
    stats: 'minimal'
  },
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'api-mocks/apis/', to: 'apis/'}
    ])
  ]
});

module.exports = config;
