export default {
  'fetch': () => require('isomorphic-fetch'),
  'Object.assign': () => require('@aofl/polyfill-service/src/object-assign-polyfill'),
  'Map': () => require('@babel/polyfill')
};
