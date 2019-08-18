import {recurseObjectByPath} from './core';

const has = (obj, path) => {
  return recurseObjectByPath(obj, path, (key, pathParts, source, recurse) => {
    if (pathParts.length === 0) {
      return typeof source[key] !== 'undefined';
    }
    if (typeof source[key] === 'undefined') {
      return false;
    }
    return recurse(pathParts, source[key]);
  });
};

export {
  has
};
