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

  Object.getOwnPropertyNames(source).forEach((prop) => {
    if (Object.hasOwnProperty.call(source, prop) && source[prop] !== null &&
    (typeof source[prop] === 'object' || typeof source[prop] === 'function') &&
    !Object.isFrozen(source[prop])) {
      deepFreeze(source[prop]);
    }
  });

  return source;
}
