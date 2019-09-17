const ignore = [
  /[\/\\]core-js/,
  /@babel[\/\\]runtime/,
];

const sourceType = 'unambiguous';

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
  // '@babel/plugin-proposal-object-rest-spread',
  // '@babel/plugin-syntax-dynamic-import',
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

if (process.env.NODE_ENV === 'test' && typeof process.env.SAUCE_USERNAME !== 'string') {
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
  ignore,
  sourceType,
  presets,
  plugins
};
