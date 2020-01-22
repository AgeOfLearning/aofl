const {environments} = require('../constants-enumerate');
const ignore = [
  /[\/\\]core-js/,
  /@babel[\/\\]runtime/,
];

const sourceType = 'unambiguous';
let compact = false;

if (process.env.NODE_ENV === environments.PRODUCTION) {
  compact = true;
}

const presets = [
  [
    "@babel/preset-env",
    {
      "modules": false,
      "useBuiltIns": false
    }
  ]
];
const plugins = [
  '@babel/plugin-proposal-optional-chaining',
  [
    '@babel/plugin-proposal-decorators',
    {
      'decoratorsBeforeExport': true
    }
  ],
  '@babel/plugin-proposal-class-properties',
  [
    '@babel/plugin-transform-runtime',
    {
      "absoluteRuntime": false,
      "corejs": false,
      "helpers": true,
      "regenerator": true,
      "useESModules": false
    }
  ]
];

if (process.env.NODE_ENV === environments.TEST && process.env.WATCH_FS !== true) {
  plugins.unshift([
    'istanbul', {
      'exclude': [
        '**/node_mobules_sourced',
        '**/node_modules',
        '**/*.spec.js',
        '**/__build',
        '**/__config'
      ]
    }
  ]);
}

module.exports = {
  compact,
  ignore,
  sourceType,
  presets,
  plugins
};
