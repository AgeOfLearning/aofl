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
        externals: {
          '@aofl/i18n': {
            commonjs2: '@aofl/i18n',
            commonjs: '@aofl/i18n',
            amd: '@aofl/i18n',
          },
          'lit-element': {
            commonjs2: 'lit-element',
            commonjs: 'lit-element',
            amd: 'lit-element',
          },
          'tiny-js-md5': {
            commonjs2: 'tiny-js-md5',
            commonjs: 'tiny-js-md5',
            amd: 'tiny-js-md5',
          }
        }
      }
    }
  }
};
