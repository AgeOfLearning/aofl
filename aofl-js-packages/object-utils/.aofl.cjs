const path = require('path');

module.exports = {
  name: '@aofl/object-utils',
  mode: 'standalone',
  build: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    devtool: 'source-map',
    entryReplace: {
      'index': path.join(__dirname, 'lib', 'index.js')
    },
    eslint: {
      options: {
        config: path.join(__dirname, '..', '.eslintrc.js')
      }
    },
    js: {
      include: [
        path.join(__dirname, 'lib')
      ]
    },
    ts: {
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
