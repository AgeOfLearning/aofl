import {recurseObjectByPath} from './core.js';

/**
 * Sets the value of a nested member of an object.
 */
const set = (obj: any, path: string, val: any) : any => {
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
