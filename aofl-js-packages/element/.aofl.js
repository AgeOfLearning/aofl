const path = require('path');

module.exports = {
  name: '@aofl/element',
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
            'lit-element': {
              commonjs2: 'lit-element',
              commonjs: 'lit-element',
              amd: 'lit-element',
            },
            'lit-element/lib/decorators': {
              commonjs2: 'lit-element',
              commonjs: 'lit-element',
              amd: 'lit-element',
            },
            'lit-html': {
              commonjs2: 'lit-html',
              commonjs: 'lit-html',
              amd: 'lit-html'
            },
            '@aofl/store': {
              commonjs2: '@aofl/store',
              commonjs: '@aofl/store',
              amd: '@aofl/store'
            },
            '@aofl/object-utils': {
              commonjs2: '@aofl/object-utils',
              commonjs: '@aofl/object-utils',
              amd: '@aofl/object-utils'
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
