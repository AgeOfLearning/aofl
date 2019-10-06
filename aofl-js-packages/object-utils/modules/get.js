/**
 * @summary get
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */

import {recurseObjectByPath} from './core';

/**
 * Returns nested property of an object based on path.
 *
 * @memberof module:@aofl/object-utils
 *
 * @param {Object} obj
 * @param {String} path dot notation
 */
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
