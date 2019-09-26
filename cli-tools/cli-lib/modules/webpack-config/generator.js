const {environments} = require('../constants-enumerate');
const webpack = require('webpack');
const AofLTemplatingPlugin = require('@aofl/templating-plugin');
const HtmlWebpackPurifycssPlugin = require('@aofl/html-webpack-purify-internal-css-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {InjectManifest} = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

const getOutput = (path, publicPath, filename) => {
  const output = {
    path,
    publicPath,
    filename,
    sourceMapFilename: '[file].map',
    pathinfo: false
  };

  return output;
};

const getCssRules = (build) => {
  const css = {
    test: build.css.test,
    include: build.css.include,
    exclude: build.css.exclude,
    issuer: build.css.issuer,
    enforce: build.css.enforce,
    use: [
      'cache-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: false,
          importLoaders: 3,
          ...build.css.cssLoader
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: false,
          cache: build.cache,
          ...build.css.postCssLoader
        }
      },
      {
        loader: '@aofl/webcomponent-css-loader',
        options: {
          sourceMap: false,
          cache: build.cache
        }
      },
      // {
      //   loader: 'sass-loader',
      //   options: {
      //     // Prefer `dart-sass`
      //     implementation: require('sass'),
      //     webpackImporter: false,
      //     sassOptions: {
      //       fibers: require('fibers')
      //     }
      //   },
      // }
    ]
  };

  return css;
};

const getEsLintRules = (build) => {
  if (build.eslint === false) { return []; }

  return [
    {
      test: build.eslint.test,
      include: build.eslint.include,
      exclude: build.eslint.exclude,
      issuer: build.eslint.issuer,
      enforce: build.eslint.enforce,
      use: [
        {
          loader: 'eslint-loader',
          options: {
            cache: build.cache,
            ...build.eslint.options
          }
        }
      ]
    }
  ];
};

const getJsRules = (build) => {
  return [
    {
      test: build.js.test,
      include: build.js.include,
      exclude: build.js.exclude,
      issuer: build.js.issuer,
      enforce: build.js.enforce,
      use: [
        'cache-loader',
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: build.cache,
            ...build.js.babel
          }
        }
      ]
    }
  ];
};

const getImageRules = (build) => {
  return [
    {
      test: build.images.test,
      include: build.images.include,
      exclude: build.images.exclude,
      issuer: build.images.issuer,
      enforce: build.images.enforce,
      use: [
        {
          loader: 'file-loader',
          options: {
            ...build.images.fileLoader
          }
        }, {
          loader: 'img-loader',
          options: {
            ...build.images.imgLoader
          }
        }
      ]
    }
  ];
};

const getFontsRules = (build) => {
  return [
    {
      test: build.fonts.test,
      include: build.fonts.include,
      exclude: build.fonts.exclude,
      issuer: build.fonts.issuer,
      enforce: build.fonts.enforce,
      use: [
        {
          loader: 'file-loader',
          options: {
            ...build.fonts.fileLoader
          }
        }
      ]
    }
  ];
};

const getTemplatingPluginOptions = (config, cache) => {
  config.loaderOptions = {
    cache,
    ...config.loaderOptions
  };

  return config;
};

const getConfig = (root, configObject) => {
  const mode = [environments.DEVELOPMENT, environments.PRODUCTION].indexOf(process.env.NODE_ENV) > -1 ?
  process.env.NODE_ENV: environments.TEST === process.env.NODE_ENV? 'production': 'none';


  const output = getOutput(configObject.build.path, configObject.build.publicPath, configObject.build.filename);

  const devtool = configObject.build.devtool || (process.env.NODE_ENV === environments.PRODUCTION ? 'nosources-source-map': 'none');

  const rules = [];

  rules.push(getCssRules(configObject.build));
  // rules.push({
  //   test: /\.js$/,
  //   inpclude: path.join(root, 'node_modules', '@webcomponents', 'webcomponentsjs')
  //   loader: 'imports-loader?this=>window'
  // });
  rules.push(...getEsLintRules(configObject.build));
  rules.push(...getJsRules(configObject.build));
  rules.push({
    test: /i18n\/index\.js$/,
    use: ['cache-loader', '@aofl/i18n-loader'],
    exclude: /node_modules/
  });
  rules.push(...getImageRules(configObject.build));
  rules.push(...getFontsRules(configObject.build));

  const plugins = [new CleanWebpackPlugin()];

  const config = {
    entry: configObject.build.entry,
    output,
    mode,
    devtool,
    module: {
      rules
    },
    plugins,
    watchOptions: {
      ignored: [path.join(root, 'node_modules')],
      poll: 2000
    },
    resolve: {
      alias: {
        'Root': root
      },
      symlinks: false,
      cacheWithContext: false
    },
    devServer: configObject.devServer,
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
              return (['custom-elements-es5-adapter', 'main'].indexOf(chunk.name) === -1 && (chunk.name.indexOf('AoflUnitTestingPlugin') === -1));
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

  if (process.env.NODE_ENV === environments.PRODUCTION) {
    config.plugins.push(new webpack.HashedModuleIdsPlugin());
    config.plugins.push(new HtmlWebpackPurifycssPlugin(configObject.build.css.global));
    config.plugins.push(new CopyWebpackPlugin([configObject.build.favicon]));
    config.plugins.push(new WebpackPwaManifest(configObject.build.pwaManifest));

    config.plugins.push(new InjectManifest(configObject.build.serviceworker));
    config.optimization.minimizer = [new TerserPlugin(configObject.build.terser)];
  } else if (process.env.NODE_ENV === environments.DEVELOPMENT) {
    config.plugins.push(new AofLTemplatingPlugin(
      getTemplatingPluginOptions(configObject.build.templating), configObject.build.cache)
    );

    config.optimization = {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    };
  }

  return merge(config, configObject.build.extend());
};

module.exports = getConfig;
