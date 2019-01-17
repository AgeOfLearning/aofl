const presets = ['@babel/preset-env'];
const plugins = [
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-optional-chaining',
  [
    '@babel/plugin-transform-runtime',
    {
      'corejs': false,
      'helpers': false,
      'regenerator': true,
      'useESModules': false
    }
  ]
];

if (process.env.NODE_ENV === 'test') {
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
  presets,
  plugins
};
