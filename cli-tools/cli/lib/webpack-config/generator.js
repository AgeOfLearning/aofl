const path = require('path');
const environmentEnumerate = require('../environment-enumerate');
const webpack = require('webpack');
const AofLTemplatingPlugin = require('@aofl/templating-plugin');
const HtmlWebpackPurifycssPlugin = require('@aofl/html-webpack-purify-internal-css-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const UnitTesting = require('@aofl/unit-testing-plugin');

const getEntry = (root) => {
  const entry = {
    'custom-elements-es5-adapter':
      path.resolve(__dirname, 'custom-elements-es5-adapter.js'),
    'main': path.resolve(root, 'modules', 'index.js')
  };

  return entry;
};

const getOutput = (path, publicPath, filename) => {
  const output = {
    path,
    publicPath,
    filename,
    sourceMapFilename: '[file].map'
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
    use: [{
      loader: 'css-loader',
      options: {
        sourceMap: false,
        cache: build.cache,
        importLoaders: build.css.component.length + 1,
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
    ...build.css.component.reduce((acc, item) => {
      acc.push({
        loader: '@aofl/webcomponent-css-loader',
        options: {
          sourceMap: false,
          cache: build.cache,
          path: item
        }
      });
      return acc;
    }, [])]
  };

  return css;
};

getEsLintRules = (build) => {
  if (build.eslint === false) return [];

  return [{
    test: build.eslint.test,
    include: build.eslint.include,
    exclude: build.eslint.exclude,
    issuer: build.eslint.issuer,
    enforce: build.eslint.enforce,
    use: [{
      loader: 'eslint-loader',
      options: {
        cache: build.cache,
        ...build.eslint.options
      }
    }]
  }];
};

const getJsRules = (build) => {
  return [{
    test: build.js.test,
    include: build.js.include,
    exclude: build.js.exclude,
    issuer: build.js.issuer,
    enforce: build.js.enforce,
    use: [{
      loader: 'babel-loader',
      options: {
        cacheDirectory: build.cache,
        ...build.js.babel
      }
    }]
  }];
};

const getImageRules = (build) => {
  return [{
    test: build.images.test,
    include: build.images.include,
    exclude: build.images.exclude,
    issuer: build.images.issuer,
    enforce: build.images.enforce,
    use: [{
      loader: 'file-loader',
      options: {
        ...build.images.fileLoader
      }
    }, {
      loader: 'img-loader',
      options: {
        ...build.images.imgLoader
      }
    }]
  }];
};

const getFontsRules = (build) => {
  return [{
    test: build.fonts.test,
    include: build.fonts.include,
    exclude: build.fonts.exclude,
    issuer: build.fonts.issuer,
    enforce: build.fonts.enforce,
    use: [{
      loader: 'file-loader',
      options: {
        ...build.fonts.fileLoader
      }
    }]
  }];
};

const getTemplatingPluginOptions = (config, cache) => {
  config.loaderOptions = {
    cache,
    ...config.loaderOptions
  };

  return config;
};

const getConfig = (root, configObject) => {
  const mode = [environmentEnumerate.DEVELOPMENT, environmentEnumerate.PRODUCTION].indexOf(process.env.NODE_ENV) > -1 ?
  process.env.NODE_ENV: 'none';

  const output = getOutput(configObject.build.path, configObject.build.publicPath, configObject.build.filename);

  const devtool = configObject.build.devtool || (process.env.NODE_ENV === environmentEnumerate.PRODUCTION ? 'nosources-source-map': 'source-map');

  const rules = [];

  rules.push(getCssRules(configObject.build));
  rules.push({
    test: /@webcomponents/,
    loader: 'imports-loader?this=>window'
  });
  rules.push(...getEsLintRules(configObject.build));
  rules.push(...getJsRules(configObject.build));
  rules.push({
    test: /i18n\/index\.js$/,
    use: '@aofl/i18n-loader'
  });
  rules.push(...getImageRules(configObject.build));
  rules.push(...getFontsRules(configObject.build));

  const plugins = [
    new webpack.HashedModuleIdsPlugin(),
    new CleanWebpackPlugin('./*', {
      root: output.path
    }),
    new AofLTemplatingPlugin(getTemplatingPluginOptions(configObject.build.templating), configObject.build.cache),
    new HtmlWebpackPurifycssPlugin(configObject.build.css.global),
    new CopyWebpackPlugin([configObject.build.favicon]),
    new WebpackPwaManifest(configObject.build.pwaManifest),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: false
    })
  ];

  let config = {
    entry: getEntry(root),
    output,
    mode,
    devtool,
    module: {
      rules
    },
    plugins,
    watchOptions: {
      ignored: [/node_modules\//]
    },
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
    },
    devServer: configObject.devServer
  };

  if (process.env.NODE_ENV === environmentEnumerate.PRODUCTION) {
    config.plugins.push(new InjectManifest(configObject.build.serviceworker));
    config.optimization.minimizer = [
      new TerserPlugin(configObject.build.terser)
    ];
  } else if (process.env.NODE_ENV === environmentEnumerate.TEST) {
    config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: configObject.unitTesting.maxChunks
    }));

    config.plugins.push(new UnitTesting({
      config: configObject.unitTesting.config,
      include: configObject.unitTesting.include,
      exclude: configObject.unitTesting.exclude,
      output: configObject.unitTesting.output,
      clean: configObject.unitTesting.clean,
      scripts: configObject.unitTesting.scripts
    }));
  } else { // development
    if (configObject.build.hardSourceCache !== false) {
      plugins.push(new HardSourceWebpackPlugin());
    }
    config.performance = {
      maxEntrypointSize: 500000,
      maxAssetSize: 500000
    };
  }

  return merge(config, configObject.build.extend());
};

module.exports = getConfig;
