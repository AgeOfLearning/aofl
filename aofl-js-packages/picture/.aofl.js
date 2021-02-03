const path = require('path');

module.exports = {
  name: '@aofl/picture',
  mode: 'stand-alone',
  build: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    devtool: 'source-map',
    entryReplace: {
      'index': path.join(__dirname, 'index.js')
    },
    eslint: {
      options: {
        config: path.join(__dirname, '..', '.eslintrc.js')
      }
    },
    css: {
      include: [
        path.join(__dirname, 'modules')
      ]
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
              amd: '@aofl/element'
            },
            '@aofl/component-utils': {
              commonjs2: '@aofl/component-utils',
              commonjs: '@aofl/component-utils',
              amd: '@aofl/component-utils'
            }
          },
          function({context, request}, callback) {
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
