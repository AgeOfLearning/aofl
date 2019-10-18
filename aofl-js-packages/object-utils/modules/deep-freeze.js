/**
 * @summary deep-freez
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */

/**
 * Recursively calls Object.freeze on objects properties
 *
 * @memberof module:@aofl/object-utils
 *
 * @param {Object} source
 * @return {Object}
 */
export function deepFreeze(source) {
  Object.freeze(source);

  for (const key in source) {
    if (Object.hasOwnProperty.call(source, key) && source[key] !== null &&
    (typeof source[key] === 'object' || typeof source[key] === 'function') &&
    !Object.isFrozen(source[key])) {
      deepFreeze(source[key]);
    }
  }

  return source;
}
