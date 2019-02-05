const config = {
  extends: ['eslint:recommended'],
  parser: 'babel-eslint',
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env: {
    node: true
  },
  rules: {
    'no-await-in-loop': 1,
    'no-console': 1,
    'no-empty': [2, {allowEmptyCatch: true}]
  },
  globals: {
    getTestContainer: true,
    cleanTestContainer: true,
    sinon: true,
    Promise: true
  }
};

module.exports = config;
