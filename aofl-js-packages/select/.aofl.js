const path = require('path');

module.exports = {
  name: '@aofl/drawer',
  mode: 'stand-alone',
  build: {
    filename: 'index.js',
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
          libraryTarget: "commonjs2"
        },
        optimization: {
          runtimeChunk: false
        },
        externals: {
          '@aofl/element': {
            commonjs2: '@aofl/element',
            commonjs: '@aofl/element',
            amd: '@aofl/element'
          },
          '@aofl/component-utils': {
            commonjs2: '@aofl/component-utils',
            commonjs: '@aofl/component-utils',
            amd: '@aofl/component-utils'
          }
        }
      }
    }
  }
};
