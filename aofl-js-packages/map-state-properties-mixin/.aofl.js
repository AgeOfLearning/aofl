const path = require('path');

module.exports = {
  name: '@aofl/map-state-properties',
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
          'lit-element': {
            commonjs2: 'lit-element',
            commonjs: 'lit-element',
            amd: 'lit-element',
          }
        }
      }
    }
  }
};
