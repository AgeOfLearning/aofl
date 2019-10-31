/**
 * @summary defaults
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */

/**
 * Assigns missing defaultOptions onto the target object.
 *
 * @memberof module:@aofl/object-utils
 *
 * @param {Object} target
 * @param {Object} defaultOptions
 *
 * @return {Object}
 */
const defaults = (target, defaults) => {
  const recurse = (t, d) => {
    for (const key in d) {
      if (!Object.prototype.hasOwnProperty.call(d, key)) continue;
      if (typeof t[key] === 'undefined') {
        if (Array.isArray(d[key])) {
          t[key] = [].concat(d[key]);
        } else if (typeof d[key] === 'object') {
          t[key] = {};
          recurse(t[key], d[key]);
        } else {
          t[key] = d[key];
        }
      } else {
        if (typeof t[key] === 'object' && !Array.isArray(t[key])) {
          recurse(t[key], d[key]);
        }
      }
    }
  };

  recurse(target, defaults);
};

export {defaults};
