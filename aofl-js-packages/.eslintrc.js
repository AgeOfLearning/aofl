const config = {
  extends: 'eslint-config-google',
  parser: 'babel-eslint',
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
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
    'indent': [
      'error', 2, {
        'CallExpression': {
          'arguments': 2,
        },
        'FunctionDeclaration': {
          'body': 1,
          'parameters': 2,
        },
        'FunctionExpression': {
          'body': 1,
          'parameters': 2,
        },
        'MemberExpression': 2,
        'ObjectExpression': 1,
        'SwitchCase': 1,
        'ignoredNodes': [
          'ConditionalExpression',
        ],
      },
    ],
    'valid-jsdoc': 'warn',
    'require-jsdoc': 'warn'
  }
};

module.exports = config;
