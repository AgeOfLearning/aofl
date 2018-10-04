/**
 * Recursively calls Object.assign along the specified path.
 *
 * @example
 * let user = {
 *   name: 'Alan',
 *   account: {
 *     active: true,
 *     products: {
 *       1: true,
 *       2: true,
 *       3: true
 *     }
 *   },
 *   preferences: {
 *    locale: 'en-US'
 *  }
 * };
 *
 * deepAssign(user, 'account.products', {
 *   2: false
 * });
 * // { // new ref
 * //   name: 'Alan',
 * //   account: { // new ref
 * //     active: true,
 * //     products: { // new ref
 * //       1: true,
 * //       2: false,
 * //       3: true
 * //     }
 * //   },
 * //   preferences: { // same ref
 * //     locale: 'en-US'
 * //   }
 * // };
 *
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @memberof module:aofl-js/object-utils-package
 * @param {Object} leftSource left source
 * @param {String} path path to target
 * @param {Object} rightSource right source
 * @return {Object}
 */
export function deepAssign(leftSource, path, rightSource) {
  let pathParts = path.split('.');
  if (path === '') {
    pathParts = [];
  }

  let recursiveAssign = (pathParts, obj) => {
    if (pathParts.length === 0) {
      return Object.assign({}, obj, rightSource);
    }

    let key = pathParts[0];
    let subPath = pathParts.splice(1);
    return Object.assign({}, obj, {
      [key]: recursiveAssign(subPath, obj[key])
    });
  };


  return recursiveAssign(pathParts, leftSource);
}
