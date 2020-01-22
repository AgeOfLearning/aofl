const config = {
  extends: ['aofl'],
  parser: 'babel-eslint',
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    mocha: true,
    jasmine: true
  },
  globals: {
    getTestContainer: true,
    cleanTestContainer: true,
    Promise: true,
    Symbol: true,
    Map: true,
    getTestContainer: true,
    fixture: true,
    __webpack_public_path__: true,
    aofljsConfig: true,
    Reflect: true,
    Proxy: true,
    Map: true,
    aoflDevtools: true
  }
};

module.exports = config;
