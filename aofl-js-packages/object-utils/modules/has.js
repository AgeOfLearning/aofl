/**
 * @summary has
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */
import {recurseObjectByPath} from './core';

/**
 * Checks if an object has a nested property defined by path.
 *
 * @memberof module:@aofl/object-utils
 *
 * @param {Object} obj
 * @param {String} path dot notation
 * @retrun {Boolean}
 */
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
