import {recurseObjectByPath} from './core';

const set = (obj, path, val) => {
  return recurseObjectByPath(obj, path, (key, pathParts, source, recurse) => {
    if (pathParts.length === 0) {
      source[key] = val;
      return;
    }
    if (typeof source[key] === 'undefined') {
      source[key] = {};
    }
    return recurse(pathParts, source[key]);
  });
};

export {
  set
};
