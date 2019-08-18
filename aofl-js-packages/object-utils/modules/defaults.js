const defaults = (target, defaults) => {
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

  recurse(target, defaults);
};

export {defaults};
