export default {
  'fetch': () => require('isomorphic-fetch'),
  'Object.assign': () => require('@aofl/polyfill-service/modules/object-assign-polyfill'),
  'Map': () => require('@babel/polyfill')
};
