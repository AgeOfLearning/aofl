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

      compilation.chunks.forEach((chunk) => {
        if (typeof chunk.name === 'string' && chunk.name.length > 0) {
          const filesIter = chunk.files.values();
          const file = filesIter.next().value;
          const url = assets.publicPath + file;
          const source = compilation.assets[file.replace(/\?.*/, '')].source();
          const sourceStr = jsStringEscape(source);
          assetsMap[chunk.name] = {
            url,
            source,
            sourceStr
          };
        }
      });

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
