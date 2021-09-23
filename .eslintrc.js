const config = {
  extends: ['aofl'],
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
    sinon: true,
    Promise: true,
    Set: true,
    browser: true
  }
};

module.exports = config;
