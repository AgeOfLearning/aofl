const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('fast-glob');
const AofLTemplatingPlugin = require('@aofl/templating-plugin');
const htmlWebpackConfig = require('./html-webpack-config');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = (mode) => {
  const config = {
    resolve: {
      modules: [
        path.resolve('./'),
        './node_modules/'
      ]
    },
    entry: {
      'custom-elements-es5-adapter':
        './node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      'web-components-loader': './node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
    },
    output: {
      path: path.join(__dirname, '..', '__build'),
      publicPath: '/',
      filename: '[chunkhash].min.js'
    },
    mode,
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /template\.html/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true,
                attrs: [
                  'aofl-img:aofl-src',
                  'aofl-source:aofl-srcset',
                  'aofl-img:src',
                  'source:srcset',
                  ':src'
                ]
              }
            }
          ]
        },
        {
          test: /language\.js$/,
          use: '@aofl/i18n-loader'
        },
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
              'presets': [
                '@babel/preset-env'
              ],
              'plugins': [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining',
                [
                  '@babel/plugin-transform-runtime',
                  {
                    'corejs': false,
                    'helpers': false,
                    'regenerator': true,
                    'useESModules': false
                  }
                ]
              ],
              'env': {
                'test': {
                  'plugins': [
                    [
                      'istanbul',
                      {
                        'include': [
                          '**/*.js'
                        ],
                        'exclude': [
                          '**/node_modules/*',
                          '**/*.spec.*',
                          '**/tests-dest/*',
                          '**/node_modules_sourced/*',
                          '**/__config/*'
                        ]
                      }
                    ]
                  ]
                }
              }
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
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ]
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new CleanWebpackPlugin('__build', {
        root: path.resolve(__dirname, '..')
      }),
      new HardSourceWebpackPlugin()
    ],
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
              return (['custom-elements-es5-adapter', 'webcomponents-loader', 'init-polyfill-service'].indexOf(chunk.name) === -1 && (chunk.name.indexOf('AoflUnitTestingPlugin') === -1));
            },
            minChunks: 2,
            minSize: 0,
            maxSize: 0,
            maxAsyncRequests: 5,
            maxInitialRequests: 3
          }
        }
      }
    },
    resolve: {
      modules: [
        path.resolve('.'),
        path.resolve('node_modules')
      ]
    }
  };

  return config;
};
