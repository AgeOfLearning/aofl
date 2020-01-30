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
  rules: {
    'no-invalid-this': 0
  },
  globals: {
    browser: true
  }
};

module.exports = config;
