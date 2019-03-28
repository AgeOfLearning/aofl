const presets = ['@babel/preset-env'];
const plugins = [
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-dynamic-import',
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
      'corejs': false,
      'helpers': false,
      'regenerator': true,
      'useESModules': false
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
  presets,
  plugins
};


if (!/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent) && typeof window.MutationObserver === 'undefined') {
  window.location = '/s/update-browser';
}