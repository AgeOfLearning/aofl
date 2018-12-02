/*eslint-disable*/
const merge = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const config = merge(common('production'), {
  devtool: 'nosources-source-map',
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true,
      cache: true,
      parallel: true,
      extractComments: true,
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      exclude: /(custom-elements-es5-adapter)/
    })
  ],
  devServer: {
    publicPath: "/",
    contentBase: path.join(__dirname, '..', '__build'),
    port: 8080,
    open: true,
    compress: true
  }
});

module.exports = config;
