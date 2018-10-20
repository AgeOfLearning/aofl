const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (mode) => {
  const config = {
    entry: {
      'custom-elements-es5-adapter':
        './node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      'polyfill-service': './__config/polyfill-service.js'
    },
    output: {
      path: path.join(__dirname, '..', '__build'),
      publicPath: '/__build/',
      filename: '[chunkhash].min.js'
    },
    mode,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false
              }
            }
          ]
        },
        {
          test: /@webcomponents/,
          loader: 'imports-loader?this=>window'
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /(node_modules|sw)/,
          use: {
            loader: 'eslint-loader',
            options: {
              configFile: path.resolve('.eslintrc.js')
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!@aofl|@polymer|lit-html).*/,
          use: {
            loader: 'babel-loader',
            options: {
              'cacheDirectory': true,
              ...require('./.babelrc.json')
            }
          }
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name]-[hash].[ext]',
                limit: 2000
              }
            },
            {
              loader: 'img-loader',
              options: {
                pngquant: {
                  speed: 1
                },
                mozjpeg: {
                  progressive: true,
                  quality: 80
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new CleanWebpackPlugin('__build', {
        root: path.resolve(__dirname, '..')
      })
    ],
    resolve: {
      modules: [
        path.resolve('./'),
        './node_modules/'
      ]
    },
    watchOptions: {
      ignored: [/node_modules\//]
    },
    externals: [
      'globalStyles'
    ],
    stats: 'minimal',
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendors: false,
          default: false,
          common: {
            name: 'common',
            chunks(chunk) {
              if (chunk.name === null) {
                return true;
              }
              return (['custom-elements-es5-adapter', 'webcomponents-loader', 'polyfill-service', 'webcomponents-bundle'].indexOf(chunk.name) === -1 && (chunk.name.indexOf('AoflUnitTestingPlugin') === -1));
            },
            minChunks: 2,
            minSize: 0,
            maxSize: 0,
            maxAsyncRequests: 5,
            maxInitialRequests: 3
          }
        }
      }
    }
  };

  return config;
};
