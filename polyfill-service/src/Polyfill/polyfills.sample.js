export default {
  'fetch': () => import('isomorphic-fetch'),
  'Reflect': () => import('harmony-reflect'),
  'Proxy': () => import('harmony-reflect'),
  'Array.prototype.find': () => import('array.prototype.find')
};
