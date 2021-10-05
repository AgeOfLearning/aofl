const {environments} = require('@aofl/cli-lib');
const webpack = require('webpack');
const AofLTemplatingPlugin = require('@aofl/templating-plugin');
const HtmlWebpackPurifycssPlugin = require('@aofl/html-webpack-purify-internal-css-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {InjectManifest} = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {merge} = require('webpack-merge');
const path = require('path');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const getOutput = (config) => {
  if (process.env.NODE_ENV === environments.TEST) {
    return {
      path: path.join(config.root, config.unitTesting.output),
      publicPath: config.unitTesting.publicPath,
      filename: config.build.filename,
      clean: config.build.clean,
      sourceMapFilename: '[file].map',
      pathinfo: false
    };
  }
  return {
    path: config.build.path,
    publicPath: config.build.publicPath,
    filename: config.build.filename,
    clean: config.build.clean,
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
          importLoaders: 3,
          ...build.css.cssLoader
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: false,
          postcssOptions: {
            ...build.css.postCssLoader.options,
            plugins: [...build.css.postCssLoader.plugins]
          }
        }
      },
      {
        loader: '@aofl/webcomponent-css-loader',
        options: {
          cache: build.cache
        }
      },
      {
        loader: 'sass-loader',
        options: {
          // Prefer `dart-sass`
          implementation: require('sass'),
          ...build.css.sassLoader
        },
      }
    ]
  };

  return css;
};

// const getEsLintRules = (build, defaultBuild) => {
//   if (build.eslint === false) { return []; }

//   return [
//     {
//       test: build.eslint.test,
//       include: getReplace('include', build.eslint, defaultBuild.eslint),
//       exclude: getReplace('exclude', build.eslint, defaultBuild.eslint),
//       issuer: build.eslint.issuer,
//       enforce: build.eslint.enforce,
//       use: [
//         {
//           loader: 'eslint-loader',
//           options: {
//             ...build.eslint.options
//           }
//         }
//       ]
//     }
//   ];
// };

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
            cacheCompression: build.js.babel.cacheCompression,
            cacheDirectory: build.cache,
            ...build.js.babel
          }
        }
      ]
    }
  ];
};

const getTsRules = (build, defaultBuild) => {
  return [
    {
      test: build.ts.test,
      include: getReplace('include', build.js, defaultBuild.js),
      exclude: getReplace('exclude', build.js, defaultBuild.js),
      issuer: build.js.issuer,
      enforce: build.js.enforce,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            ...build.ts.options
          }
        }
      ]
    }
  ];
};

const getAssetRules = (build, defaultBuild) => {
  return [
    {
      test: build.assets.test,
      type: 'asset',
      include: getReplace('include', build.assets, defaultBuild.assets),
      exclude: getReplace('exclude', build.assets, defaultBuild.assets),
      issuer: build.assets.issuer,
      enforce: build.assets.enforce,
      parser: build.assets.parser
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
      type: 'asset/resource'
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
  // rules.push({
  //   test: /@webcomponents/,
  //   loader: 'imports-loader',
  //   options: {
  //     wrapper: {
  //       thisArg: 'window',
  //     }
  //   }
  // });
  rules.push(getCssRules(configObject.build, defaultOptions.build));
  // rules.push(...getEsLintRules(configObject.build, defaultOptions.build));
  rules.push({
    test: /\.js$/,
    include: [path.join(root, 'node_modules')],
    use: ['source-map-loader'],
    enforce: 'pre'
  });

  rules.push(...getJsRules(configObject.build, defaultOptions.build));
  rules.push(...getTsRules(configObject.build, defaultOptions.build));

  if (configObject.mode === 'app') {
    rules.push({
      test: /i18n\/index\.js$/,
      use: ['@aofl/i18n-loader'],
      exclude: /node_modules/
    });
  }
  rules.push(...getAssetRules(configObject.build, defaultOptions.build));
  rules.push(...getFontsRules(configObject.build, defaultOptions.build));

  rules.push(
    {
      resourceQuery: /inline/,
      type: 'asset/inline',
      include: path.join(__dirname, 'src'),
    },
    {
      resourceQuery: /raw/,
      type: 'asset/source',
      include: path.join(__dirname, 'src'),
    }
  );

  const plugins = [];
  for (let i = 0; i < configObject.build.dll.references.length; i++) {
    plugins.push(new webpack.DllReferencePlugin(configObject.build.dll.references[i]));
  }

  if (configObject.build.dll.references.length > 0) {
    plugins.push(new CopyPlugin({
      patterns: [{from: configObject.build.dll.source, to: 'dll'}]
    }));
  }

  const config = {
    entry: configObject.build.entryReplace || configObject.build.entry,
    output,
    mode,
    devtool,
    module: {
      rules,
    },
    plugins,
    watchOptions: {
      ignored: ['node_modules']
    },
    resolve: {
      alias: {
        'Root': root
      },
      extensions: ['.ts', '.tsx', '.js', '.json', 'wasm', '.css', '.scss'],
      symlinks: false,
      cacheWithContext: false
    },
    devServer: configObject.devServer,
    stats: 'minimal',
    ignoreWarnings: [/warning/i, /Failed to parse source map/i],
    performance: {
      assetFilter: (asset) => {
        return asset.match(/polyfills/i) === null;
      }
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
    }
  };

  if (configObject.build.cache === true) {
    config.cache = {
      type: 'filesystem',
    };
  }
  if (process.env.NODE_ENV === environments.PRODUCTION) {
    config.plugins.push(new webpack.ids.DeterministicModuleIdsPlugin());
    if (configObject.mode === 'app') {
      config.plugins.push(new AofLTemplatingPlugin(
        getTemplatingPluginOptions(configObject.build.templating), configObject.build.cache)
      );

      config.plugins.push(new HtmlWebpackPurifycssPlugin(configObject.build.css.global));

      config.plugins.push(new ImageMinimizerPlugin(configObject.build.assets.options));

      if (configObject.build.favicon) {
        config.plugins.push(new CopyWebpackPlugin({
          patterns: [configObject.build.favicon]
        }));
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
    if (configObject.mode === 'app') {
      config.plugins.push(new AofLTemplatingPlugin(
        getTemplatingPluginOptions(configObject.build.templating), configObject.build.cache)
      );
    }

    delete config.optimization;
  }

  return merge(config, configObject.build.extend() || {});
};

module.exports = getConfig;
