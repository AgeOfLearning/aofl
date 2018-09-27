export default {
  'fetch': () => import('isomorphic-fetch'),
  'Object.assign': () => import('@aofl/polyfill-service/src/object-assign-polyfill')
};
