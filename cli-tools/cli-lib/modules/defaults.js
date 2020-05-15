const defaults = (options = {}, defaults) => {
  for (const key in defaults) {
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) continue;
    if (typeof options[key] === 'undefined') {
      options[key] = defaults[key];
    }
  }

  return options;
};

const defaultsDeep = (options = {}, defaults) => {
  for (const key in defaults) {
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) continue;

    const val = options[key];
    if (typeof val === 'undefined') {
      options[key] = defaults[key];
    } else if (val.constructor === Object) {
      defaultsDeep(val, defaults[key]);
    }
  }

  return options;
};


module.exports.defaults = defaults;
module.exports.defaultsDeep = defaultsDeep;
