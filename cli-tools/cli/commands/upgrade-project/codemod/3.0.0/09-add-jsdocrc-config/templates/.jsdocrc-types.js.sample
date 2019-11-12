const babelrc = require('@aofl/cli-lib/modules/webpack-config/.babelrc.js');

module.exports = {
  "plugins": ["node_modules/jsdoc-babel"],
  "babel": {
    ...babelrc
  },
  "source": {
    "include": ".",
    "includePattern": "\\.js$",
    "excludePattern": "(node_modules/|api-docs|__build|__build_tests|coverage)"
  },
  "opts": {
    "template": "./node_modules/tsd-jsdoc/dist",
    "encoding": "utf8",
    "destination": ".",
    "recurse": true,
    "verbose": true
  }
};
