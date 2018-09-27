const jsStringEscape = require('js-string-escape');

module.exports = (environment = 'production') => {
  return {
    inject: false,
    minify: {
      minifyJS: environment === 'production',
      minifyCSS: environment === 'production',
      collapseWhitespace: environment === 'production',
      removeComments: environment === 'production'
    },
    cache: true,
    alwaysWriteToDisk: true,
    templateParameters(compilation, assets, options) {
      let assetsMap = {};
      for (let key in assets.chunks) {
        if (!assets.chunks.hasOwnProperty(key)) continue;
        let url = assets.chunks[key].entry;
        let source = compilation.assets[url.substr(assets.publicPath.length)].source();
        let sourceStr = jsStringEscape(source);
        assetsMap[key] = {
          url,
          source,
          sourceStr
        };
      }
      return {
        compilation: compilation,
        webpack: compilation.getStats().toJson(),
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
          files: assets,
          options: options
        },
        assetsMap
      };
    }
  };
};
