/**
 *
 *
 * @param {String[]} args
 * @return {Object}
 */
function observe(...args) {
  return (descriptor, name) => {
    if (args.length > 0) {
      descriptor.finisher = (clazz) => {
        if (typeof clazz.prototype.observedProperties === 'undefined') {
          clazz.prototype.observedProperties = {};
        }

        clazz.prototype.observedProperties[descriptor.key] = {
          keys: args,
          values: args,
          value: ''
        };
      };
    }

    return descriptor;
  };
}

export {
  observe
};
