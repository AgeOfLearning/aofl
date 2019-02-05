const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const config = merge(common('development'), {
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '..', '__build'),
    port: 8080,
    open: true,
    stats: 'minimal',
    historyApiFallback: true
    // useLocalIp: true
  },
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000
  },
  plugins: [new HardSourceWebpackPlugin()]
});

module.exports = config;
