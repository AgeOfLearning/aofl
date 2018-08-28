const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AofLTemplatingPlugin = require('@aofl/templating-plugin');
const htmlWebpackConfig = require('./html-webpack-config');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = (mode) => {
  const config = {
    entry: {
      'custom-elements-es5-adapter': './node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      'aofljs': './js/main.js',
      'webcomponents-loader': './js/webcomponents-loader/index.js'
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
          test: /\.md$/,
          use: [
            'html-loader',
            {
              loader: 'markdown-loader'
            }
          ]
        },
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
          exclude: /\/webcomponentsjs\/custom-elements-es5-adapter\.js$/,
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
                          '**/__config/*',
                          'js/webcomponents-loader',
                          '**/*-{instance,enumerate}/*'
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
        },
        {
          test: /\.(woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              limit: 1
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new CleanWebpackPlugin('__build', {
        root: path.resolve(__dirname, '..')
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          '..',
          'templates',
          'main',
          'template.ejs'
        ),
        filename: 'templates/main/template.html',
        ...htmlWebpackConfig(mode)
      }),
      new AofLTemplatingPlugin({
        template: path.resolve(
          __dirname,
          '..',
          'templates',
          'main',
          'template.ejs'
        ),
        templateFilename: 'templates/main/template.html',
        filename: 'index.html',
        mainRoutes: 'routes',
        locale: 'en-US',
        inlineConfig: true,
        routes: {
          pattern: path.join(__dirname, '..', 'routes*', '*', 'index.js'),
          ignore: ['**/__build/**/*', '**/node_modules/**/*']
        }
      }),
      new HardSourceWebpackPlugin()
    ],
    watchOptions: {
      ignored: [/node_modules\//]
    },
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
              return (['custom-elements-es5-adapter', 'webcomponents-loader'].indexOf(chunk.name) === -1 && (chunk.name.indexOf('AoflUnitTestingPlugin') === -1));
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
