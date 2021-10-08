import {recurseObjectByPath} from './core.js';

/**
 * Recursively calls Object.assign along the specified path.
 *
 * @param left reference object
 * @param path path to a nested key. Use dot notation. E.g. prop.prop.prop
 * @param right Object to assign to path
 *
 * @example
 * ```typescript
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
 * ```
 */
const deepAssign = (left: any, path: string, right: any) : any => {
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
