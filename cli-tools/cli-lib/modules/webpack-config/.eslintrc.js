const config = {
  extends: ['aofl'],
  parser: "@babel/eslint-parser",
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  globals: {
    getTestContainer: true,
    cleanTestContainer: true,
    __webpack_public_path__: true,
    aofljsConfig: true
  }
};

module.exports = config;
