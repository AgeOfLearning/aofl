import {recurseObjectByPath} from './core.js';

/**
 * Returns nested property of an object based on path.
 */
const get = (obj: any, path: string): any => {
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
