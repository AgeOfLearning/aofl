const jsStringEscape = require('js-string-escape');
const {environments} = require('./constants-enumerate');

module.exports = (environment = environments.DEVELOPMENT) => {
  return {
    inject: false,
    minify: {
      minifyJS: environment === environments.PRODUCTION,
      minifyCSS: environment === environments.PRODUCTION,
      collapseWhitespace: environment === environments.PRODUCTION,
      removeComments: environment === environments.PRODUCTION
    },
    cache: true,
    alwaysWriteToDisk: true,
    templateParameters(compilation, assets, options) {
      const assetsMap = {};

      for (const key in compilation.chunks) {
        if (!compilation.chunks.hasOwnProperty(key)) continue;
        const chunk = compilation.chunks[key];
        if (typeof chunk.name === 'string' && chunk.name.length > 0) {
          const url = assets.publicPath + chunk.files[0];
          const source = compilation.assets[chunk.files[0].replace(/\?.*/, '')].source();
          const sourceStr = jsStringEscape(source);
          assetsMap[chunk.name] = {
            url,
            source,
            sourceStr
          };
        }
      }

      return {
        compilation,
        webpack: compilation.getStats().toJson(),
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
          files: assets,
          options
        },
        assetsMap,
        mode: compilation.compiler.options.mode
      };
    }
  };
};
