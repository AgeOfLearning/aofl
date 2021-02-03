const {environments} = require('@aofl/cli-lib');
const webpack = require('webpack');
const AofLTemplatingPlugin = require('@aofl/templating-plugin');
const HtmlWebpackPurifycssPlugin = require('@aofl/html-webpack-purify-internal-css-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {InjectManifest} = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

const getOutput = (config) => {
  if (process.env.NODE_ENV === environments.TEST) {
    return {
      path: path.join(config.root, config.unitTesting.output),
      publicPath: config.unitTesting.publicPath,
      filename: config.build.filename,
      sourceMapFilename: '[file].map',
      pathinfo: false
    };
  }
  return {
    path: config.build.path,
    publicPath: config.build.publicPath,
    filename: config.build.filename,
    sourceMapFilename: '[file].map',
    pathinfo: false
  };
};

const getReplace = (key, userDefined, defaultOption) => {
  if (typeof userDefined.replace !== 'undefined' && typeof userDefined.replace[key] !== 'undefined') {
    return userDefined.replace[key];
  }

  const merged = Array.from(new Set([...userDefined[key], ...defaultOption[key]]));
  return merged;
};

const getCssRules = (build, defaultBuild) => {
  const css = {
    test: build.css.test,
    include: getReplace('include', build.css, defaultBuild.css),
    exclude: getReplace('exclude', build.css, defaultBuild.css),
    issuer: build.css.issuer,
    enforce: build.css.enforce,
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: false,
          importLoaders: 2,
          ...build.css.cssLoader
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: false,
          postcssOptions: {
            ...build.css.postCssLoader.options,
            plugins: [
              ...build.css.postCssLoader.plugins
            ]
          }
        }
      },
      {
        loader: '@aofl/webcomponent-css-loader',
        options: {
          cache: build.cache
        }
      }
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

const getEsLintRules = (build, defaultBuild) => {
  if (build.eslint === false) { return []; }

  return [
    {
      test: build.eslint.test,
      include: getReplace('include', build.eslint, defaultBuild.eslint),
      exclude: getReplace('exclude', build.eslint, defaultBuild.eslint),
      issuer: build.eslint.issuer,
      enforce: build.eslint.enforce,
      use: [
        {
          loader: 'eslint-loader',
          options: {
            ...build.eslint.options
          }
        }
      ]
    }
  ];
};

const getJsRules = (build, defaultBuild) => {
  return [
    {
      test: build.js.test,
      include: getReplace('include', build.js, defaultBuild.js),
      exclude: getReplace('exclude', build.js, defaultBuild.js),
      issuer: build.js.issuer,
      enforce: build.js.enforce,
      use: [
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

const getImageRules = (build, defaultBuild) => {
  return [
    {
      test: build.images.test,
      include: getReplace('include', build.images, defaultBuild.images),
      exclude: getReplace('exclude', build.images, defaultBuild.images),
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

const getFontsRules = (build, defaultBuild) => {
  return [
    {
      test: build.fonts.test,
      include: getReplace('include', build.fonts, defaultBuild.fonts),
      exclude: getReplace('exclude', build.fonts, defaultBuild.fonts),
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
    ...config.loaderOptions
  };

  return config;
};

const getConfig = (root, configObject, defaultOptions) => {
  const mode = [environments.DEVELOPMENT, environments.PRODUCTION].indexOf(process.env.NODE_ENV) > -1 ?
  process.env.NODE_ENV: environments.TEST === process.env.NODE_ENV? 'production': 'none';


  const output = getOutput(configObject);

  const devtool = configObject.build.devtool || (process.env.NODE_ENV === environments.PRODUCTION ? 'nosources-source-map': 'none');

  const rules = [];
  rules.push({
    test: /@webcomponents/,
    loader: 'imports-loader',
    options: {
      wrapper: {
        thisArg: 'window',
      }
    }
  });
  rules.push(getCssRules(configObject.build, defaultOptions.build));
  rules.push(...getEsLintRules(configObject.build, defaultOptions.build));
  rules.push({
    test: /\.js$/,
    include: [path.join(root, 'node_modules')],
    use: ['source-map-loader'],
    enforce: 'pre'
  });
  rules.push(...getJsRules(configObject.build, defaultOptions.build));
  if (configObject.mode === 'project') {
    rules.push({
      test: /i18n\/index\.js$/,
      use: [
        '@aofl/i18n-loader'
      ],
      exclude: /node_modules/
    });
  }
  rules.push(...getImageRules(configObject.build, defaultOptions.build));
  rules.push(...getFontsRules(configObject.build, defaultOptions.build));

  const plugins = [new CleanWebpackPlugin()];

  const config = {
    entry: configObject.build.entryReplace || configObject.build.entry,
    output,
    mode,
    devtool,
    module: {
      rules
    },
    plugins,
    watchOptions: {
      ignored: ['node_modules']
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
    config.plugins.push(new webpack.ids.DeterministicModuleIdsPlugin());
    if (configObject.mode === 'project') {
      config.plugins.push(new AofLTemplatingPlugin(
        getTemplatingPluginOptions(configObject.build.templating), configObject.build.cache)
      );
      config.plugins.push(new HtmlWebpackPurifycssPlugin(configObject.build.css.global));

      if (configObject.build.favicon) {
        config.plugins.push(new CopyWebpackPlugin([configObject.build.favicon]));
      }

      if (configObject.build.pwaManifest) {
        config.plugins.push(new WebpackPwaManifest(configObject.build.pwaManifest));
      }

      if (configObject.build.serviceworker) {
        config.plugins.push(new InjectManifest(configObject.build.serviceworker));
      }
    }
    config.optimization.minimizer = [new TerserPlugin(configObject.build.terser)];
  } else if (process.env.NODE_ENV === environments.DEVELOPMENT) {
    if (configObject.mode === 'project') {
      config.plugins.push(new AofLTemplatingPlugin(
        getTemplatingPluginOptions(configObject.build.templating), configObject.build.cache)
      );
    }

    config.optimization = {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    };
  }

  return merge(config, configObject.build.extend());
};

module.exports = getConfig;
