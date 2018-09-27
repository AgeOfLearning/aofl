/**
 * Recursively calls Object.freeze on objects properties
 *
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */


/**
 * Recursively calls Object.freeze on objects properties
 *
 * @param {Object} source
 * @return {Object}
 */
export function deepFreeze(source) {
  Object.freeze(source);

  Object.getOwnPropertyNames(source).forEach((prop) => {
    if (source.hasOwnProperty(prop) && source[prop] !== null &&
    (typeof source[prop] === 'object' || typeof source[prop] === 'function') &&
    !Object.isFrozen(source[prop])) {
      deepFreeze(source[prop]);
    }
  });

  return source;
};
