import {recurseObjectByPath} from './core.js';

/**
 * Checks if an object has a nested property defined by path.
 *
 * @param obj reference object to check
 * @param path path to a nested key. Use dot notation. E.g. prop.prop.prop
 */
const has = (obj: any, path: string) : boolean => {
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
