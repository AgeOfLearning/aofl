window.aofljsConfig = window.aofljsConfig || {};
window.aofljsConfig.routesConfig = {
  'routes': [
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
