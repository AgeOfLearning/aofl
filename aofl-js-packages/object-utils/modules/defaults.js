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
const defaults = (target, defaultOptions) => {
  const recurse = (t, d) => {
    for (const key in d) {
      if (!d.hasOwnProperty(key)) continue;
      if (typeof t[key] === 'undefined') {
        t[key] = Object.assign({}, d[key]);
        continue;
      }
      if (typeof d[key] === 'object' && !Array.isArray(d[key])) {
        recurse(t[key], d[key]);
      }
    }
  };

  recurse(target, defaultOptions);
};

export {defaults};
