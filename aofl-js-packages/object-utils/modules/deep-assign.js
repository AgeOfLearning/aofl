/**
 * @summary deep-assign
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */
import {recurseObjectByPath} from './core';

/**
 * Recursively calls Object.assign along the specified path.
 *
 * @memberof module:@aofl/object-utils
 * @example
 * let user = {
 *   name: 'Alan',
 *   account: {
 *     active: true,
 *     products: {
 *       '1': true,
 *       '2': true,
 *       '3': true
 *     }
 *   },
 *   preferences: {
 *     locale: 'en-US'
 *   }
 * };
 *
 * deepAssign(user, 'account.products', {
 *   2: false
 * });
 * { // new ref
 *   name: 'Alan',
 *   account: { // new ref
 *     active: true,
 *     products: { // new ref
 *       '1': true,
 *       '2': false,
 *       '3': true
 *     }
 *   },
 *   preferences: { // same ref
 *     locale: 'en-US'
 *   }
 * };
 * @param {Object} left left source
 * @param {String} path path to target
 * @param {Object} right right source
 * @return {Object}
 */
const deepAssign = (left, path, right) => {
  return recurseObjectByPath(left, path, (key, pathParts, source, recurse) => {
    if (pathParts.length === 0) {
      if (key === '') {
        return Object.assign({}, source, right);
      }
      return Object.assign({}, source, {
        [key]: Object.assign({}, source[key], right)
      });
    }

    return Object.assign({}, source, {
      [key]: recurse(pathParts, source[key])
    });
  });
};

export {
  deepAssign
};
