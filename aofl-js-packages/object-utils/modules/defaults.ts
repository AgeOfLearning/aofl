/**
 * Assigns missing defaultOptions onto the target object.
 *
 * @param target reference to object that will be modified by defaults
 * @param defaults default values
 */
const defaults = (target: any, defaults: any): void => {
  const recurse = (t: any, d: any) => {
    for (const key in d) {
      /* istanbul ignore next */
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
