/**
 * @summary generate-basic-mutations
 * @version 2.0.0
 * @since 2.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */

/**
 * Generates setters for given object.
 * @memberof module:@aofl/store/legacy
 * @deprecated
 * @param {Object} config
 *
 * @return {Object}
 */
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
