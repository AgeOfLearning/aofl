const merge = require('webpack-merge');
const common = require('./__config/webpack.common');
const path = require('path');

const config = merge(common('development'), {
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '__build'),
    port: 8080,
    open: true,
    stats: 'minimal',
    historyApiFallback: true
    // useLocalIp: true
  },
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000
  }
});

module.exports = config;
