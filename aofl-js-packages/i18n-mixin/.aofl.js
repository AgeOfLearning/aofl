const path = require('path');

module.exports = {
  name: '@aofl/i18n-mixin',
  mode: 'stand-alone',
  build: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    entryReplace: {
      'index': path.join(__dirname, 'index.js')
    },
    eslint: {
      options: {
        config: path.join(__dirname, '..', '.eslintrc.js')
      }
    },
    js: {
      include: [
        path.join(__dirname, 'modules')
      ]
    },
    extend() {
      return {
        output: {
          libraryTarget: 'commonjs2'
        },
        optimization: {
          runtimeChunk: false
        },
        externals: [
          {
            '@aofl/element': {
              commonjs2: '@aofl/element',
              commonjs: '@aofl/element',
              amd: '@aofl/element',
            },
            '@aofl/i18n': {
              commonjs2: '@aofl/i18n',
              commonjs: '@aofl/i18n',
              amd: '@aofl/i18n',
            },
            'lit-html': {
              commonjs2: 'lit-html',
              commonjs: 'lit-html',
              amd: 'lit-html',
            },
            'tiny-js-md5': {
              commonjs2: 'tiny-js-md5',
              commonjs: 'tiny-js-md5',
              amd: 'tiny-js-md5',
            }
          },
          function(context, request, callback) {
            if (/^core-js\//.test(request) || /^@babel\//.test(request) || /^regenerator-runtime\/runtime$/.test(request)){
              return callback(null, 'commonjs ' + request);
            }
            callback();
          }
        ]
      }
    }
  }
};
