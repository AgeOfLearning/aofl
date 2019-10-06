/**
 * @summary set
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */
import {recurseObjectByPath} from './core';

/**
 * Sets the value of a nested member of an object.
 *
 * @memberof module:@aofl/object-utils
 * @param {Object} obj
 * @param {String} path
 * @param {*} val
 */
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
