window.aofljsConfig = window.aofljsConfig || {};
window.aofljsConfig.routesConfig = {
  'routes': [
    {
      'resolve': () => import('./routes/code-example-element/index.js'),
      'rotation': 'routes',
      'path': '/aofl-code/',
      'dynamic': false,
      'title': 'AofL::aofl-code',
      'locale': ''
    },
    {
      'resolve': () => import('./routes/home-element/index.js'),
      'rotation': 'routes',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home',
      'locale': ''
    }
  ]
};
