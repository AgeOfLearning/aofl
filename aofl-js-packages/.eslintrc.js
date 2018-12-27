const config = {
  extends: 'eslint-config-google',
  parser: 'babel-eslint',
  root: true,
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    exmaFeatures: {
      experimentalObjectRestSpread: true
    },
    env: {
      es6: true
    }
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', {
      code: 120,
      tabWidth: 2,
      ignoreComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true
    }],
    'space-in-parens': ['error', 'never'],
    indent: ['warn'],
    'valid-jsdoc': 'warn',
    'require-jsdoc': 'warn'
  }
};

module.exports = config;
