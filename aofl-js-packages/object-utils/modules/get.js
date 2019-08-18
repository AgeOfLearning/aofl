import {recurseObjectByPath} from './core';

const get = (obj, path) => {
  return recurseObjectByPath(obj, path, (key, pathParts, source, recurse) => {
    if (pathParts.length === 0) {
      return source[key];
    }

    if (typeof source[key] === 'undefined') {
      return;
    }
    return recurse(pathParts, source[key]);
  });
};

export {get};
