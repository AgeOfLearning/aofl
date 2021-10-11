const path = require('path');
const {environments, resources, htmlWebpackConfig} = require('@aofl/cli-lib');

const postCssPlugins = ['autoprefixer'];

if (process.env.NODE_ENV === environments.PRODUCTION) {
  postCssPlugins.push('cssnano');
}

module.exports = (root) => {
  return {
    name: 'Aofl JS App',
    root,
    mode: 'app', // app | standalone
    build: {
      filename: process.env.NODE_ENV === environments.PRODUCTION ? '[name]-[chunkhash].js': '[name].js',
      entry: {
        'custom-elements-es5-adapter': resources.CUSTOM_ELEMENTS_ES5_ADAPTER,
        'main': path.resolve(root, 'src', 'modules', 'index.js')
      },
      target: 'web',
      path: path.join(root, '__build'),
      publicPath: '/',
      devtool: (process.env.NODE_ENV === environments.PRODUCTION ? 'nosources-source-map': 'source-map'), // cheap-module-eval-source-map
      cache: true,
      clean: true,
      middleware: [],
      extend: () => {},
      css: {
        test: /\.s?[ac]ss$/i,
        include: [
          path.join(root, 'src'),
          path.join(root, 'node_modules', '@aofl', 'unit-testing'),
          path.join(root, 'node_modules', '.cache', 'AoflUnitTestingPlugin'),
          path.join(root, 'node_modules', '@aofl', 'cli', 'commands', 'test-project')
        ],
        exclude: [],
        purgeCssLoader: {
          cache: true,
          settings: {
            fontFace: true,
            keyframes: true,
            variables: true,
            safelist: [':host'],
            blocklist: [],
          },
          files: {}
        },
        cssLoader: {}, // options
        postCssLoader: {
          options: {},
          plugins: postCssPlugins
        }, // options
        sassLoader: {
          sourceMap: false,
          sassOptions: {
            fiber: require('fibers')
          }
        }
      },
      assets: {
        test: /\.(jpe?g|png|gif|tif|webp|svg|avif|mp3|aac|ogg|webm|mp4|ogv|pdf)$/i,
        include: [path.join(root, 'src')],
        exclude: [],
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
        options: {
          minimizerOptions: {
            plugins: process.env.NODE_ENV === 'production' && [
              ['gifsicle', {interlaced: true}],
              ['jpegtran', {progressive: true}],
              ['optipng', {optimizationLevel: 5}],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                        },
                      },
                    },
                  ]
                }
              ]
            ]
          }
        }
      },
      fonts: {
        test: /\.(woff|woff2|eot\??|ttf|otf|svg#.*)$/i,
        include: [path.join(root, 'src')],
        exclude: [],
        type: 'asset/resource'
      },
      // eslint: {
      //   test: /\.js$/,
      //   include: [path.join(root, 'src')],
      //   exclude: [],
      //   enforce: 'pre',
      //   options: {
      //     config: path.join(root, '.eslintrc.js'),
      //     cache: false
      //   },
      // },
      js: {
        test: /\.m?js$/,
        include: [
          path.join(root, 'src'),
          path.join(root, 'node_modules', '@aofl', 'unit-testing'),
          path.join(root, 'node_modules', '.cache', 'AoflUnitTestingPlugin'),
          path.join(root, 'node_modules', '@aofl', 'polyfill-service'),
          path.join(root, 'node_modules', 'lit-element'),
          path.join(root, 'node_modules', 'lit-html'),
          path.join(root, 'node_modules', '@aofl', 'cli', 'commands', 'test-project'),
          path.join(root, 'node_modules', '@webcomponents')
        ],
        exclude: [],
        babel: {
          cacheCompression: false,
          cacheDirectory: true,
          ...require('@aofl/cli-lib/modules/webpack-config/.babelrc.js'),
        },
      },
      ts: {
        test: /\.tsx?$/i,
        include: [path.join(root, 'src')],
        options: {
          transpileOnly: true,
        }
      },
      templating: {
        template: {
          name: 'main',
          template: path.resolve(root, 'src', 'template', 'template.ejs'),
          filename: path.join('template', 'template.html'),
          ...htmlWebpackConfig(process.env.NODE_ENV),
        },
        routes: {
          mainRoutes: path.join(root, 'src', 'routes'),
          pattern: [path.join('src', 'routes', '**', 'route.js')],
          ignore: ['**/__build/**/*', '**/node_modules/**/*'],
        },
        loaderOptions: {
          path: path.join(root, 'src', 'modules', '__config', 'routes.js'),
          cache: false
        },
      },
      hmr: {
        cache: true,
        decorators: ['customElement'],
        baseClasses: ['AoflElement', 'LitElement']
      },
      serviceworker: {
        swSrc: path.join(resources.WEBPACK_CONFIG, 'sw.js'),
        swDest: 'sw.js',
        exclude: [/\.LICENSE$/, /\.map\.js$/],
      },
      favicon: {
        from: 'src/assets/favicon.ico',
        to: 'favicon.ico',
      },
      pwaManifest: {
        'name': 'Aofl Starter App',
        'short_name': 'AoflStarter',
        'description': 'Aofl Starter App',
        'display': 'standalone',
        'theme-color': '#fdf667',
        'background_color': '#fdf667',
        'crossorigin': 'use-credentials', // can be null, use-credentials or anonymous
        'ios': {
          'apple-mobile-web-app-title': 'Aofl Starter App',
          'apple-mobile-web-app-status-bar-style': '#fdf667',
        },
        'icons': [
          {
            src: 'src/assets/manifest/icon-48x48.png',
            sizes: '48x48',
          },
          {
            src: 'src/assets/manifest/icon-72x72.png',
            sizes: '72x72',
          },
          {
            src: 'src/assets/manifest/icon-96x96.png',
            sizes: '96x96',
          },
          {
            src: 'src/assets/manifest/icon-144x144.png',
            sizes: '144x144',
          },
          {
            src: 'src/assets/manifest/icon-192x192.png',
            sizes: '192x192',
          },
          {
            src: 'src/assets/manifest/icon-512x512.png',
            sizes: '512x512',
          },
        ],
      },
      dll: {
        source: path.join(root, 'dll'),
        references: []
      }
    },
    devServer: {
      static: {
        directory: path.join(root, '__build'),
      },
      hot: true,
      open: true,
      port: 8080,
      host: 'localhost',
      historyApiFallback: true,
    },
    unitTesting: {
      root,
      output: '__build_tests',
      host: 'localhost',
      port: 3035,
      config: path.join(root, '.wct.config.js'),
      polyfill: path.join(root, 'src', 'modules', '__config', 'polyfills.js'),
      specs: ['src/**/*.spec.js'],
      suites: {},
      nycArgs: [
        'report',
        '--reporter=lcov',
        '--reporter=text-summary',
        '--report-dir=./logs/coverage'
      ],
      mocha: {
        ui: 'bdd',
        timeout: 10000
      },
      exclude: [
        '**/__build*',
        '**/node_modules',
        '**/node_modules_sourced',
        '**/__config',
        '**/*-instance/**',
        '**/*-polyfill/**',
        'sw.js',
        'coverage',
        'logs'
      ]
    },
  };
};
