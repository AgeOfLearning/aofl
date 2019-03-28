export default {
  'fetch': () => import('isomorphic-fetch'),
  'Reflect': () => import('harmony-reflect'),
  'Proxy': () => import('harmony-reflect'),
  'Array.prototype.find': () => import('array.prototype.find'),
  'html-imports': {
    test() {
      return !('import' in document.createElement('link'));
    },
    load: () => import('@webcomponents/webcomponentsjs/webcomponents-bundle')
  }
};
