const generateMutations = (config) => {
  const mutations = {};

  for (const key in config) {
    /* istanbul ignore next */
    if (!config.hasOwnProperty(key)) continue;

    mutations[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`] = (subState, payload) => {
      return Object.assign({}, subState, {
        [key]: payload
      });
    };
  }

  return mutations;
};

export {
  generateMutations
};
