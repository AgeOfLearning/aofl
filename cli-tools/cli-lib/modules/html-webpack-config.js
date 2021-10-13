const path = require('path');
const jsStringEscape = require('js-string-escape');
const {environments} = require('./constants-enumerate');
const glob = require('fast-glob');
const {HtmlTagArray} = require('html-webpack-plugin/lib/html-tags');

module.exports = (environment = environments.DEVELOPMENT, dllDir) => {
  let dlls = {};
  if (typeof dllDir !== 'undefined') {
    const dllFiles = glob.sync('*.js', {cwd: path.resolve(dllDir)});
    dlls = dllFiles.reduce((acc, item) => {
      const name = item.split('-')[0].replace('dll/', '');
      acc[name] = {
        url: item,
        source: '',
        sourceStr: ''
      };
      return acc;
    }, {});
  }

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
    templateParameters(compilation, assets, assetTags, options) {
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

      for (const key in dlls) {
        if (!Object.prototype.hasOwnProperty.call(dlls, key)) continue;
        assetsMap[key] = {
          ...dlls[key],
          url: assets.publicPath + dlls[key].url,
        };
      }

      const bodyTags = [];
      const tags = {
        ...assetTags,
        headTags: HtmlTagArray.from([
          ...assetTags.headTags.reduce((acc, tag) => {
            if (tag.tagName === 'meta') {
              acc.push(tag);
            } else {
              bodyTags.push(tag);
            }
            return acc;
          }, [])
        ]),
        bodyTags: HtmlTagArray.from([
          ...bodyTags,
          ...assetTags.bodyTags
        ])
      };

      return {
        compilation,
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
          files: assets,
          options,
          tags
        },
        assetsMap,
        mode: compilation.compiler.options.mode
      };
    }
  };
};
