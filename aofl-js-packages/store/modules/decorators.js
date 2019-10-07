/**
 * @summary decorators
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */
/**
 * v2 decorator adds observed properties to an Sdo's instance to support memoized
 * getters.
 *
 * @memberof module:@aofl/store
 *
 * @param {String[]} args
 * @return {Object}
 */
function decorate(...args) {
  return (descriptor, name) => {
    if (args.length === 0) {
      throw new TypeError('@aofl/store#decorate requires at least 1 argumen, but only 0 were passed');
    }
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

    return descriptor;
  };
}

/**
 * Proxies state properties to store and converts instance properties to getters that return
 * values from store.
 *
 * @memberof module:@aofl/store
 * @return {Object}
 */
function state() {
  return (descriptor) => {
    const key = descriptor.key;
    return {
      kind: 'field',
      key: Symbol(),
      placement: 'own',
      descriptor: {},
      initializer() {
        const val = descriptor.initializer.call(this);
        if (typeof this.constructor.initialState === 'undefined') {
          this.constructor.initialState = {};
        }
        if (typeof this.constructor.initialState[key] === 'undefined') {
          this.constructor.initialState[key] = val;
        }

        Object.defineProperty(this, key, {
          get() {
            return this.state[key];
          },
          set(value) {
            this.commit(Object.assign({}, this.state, {
              [key]: value
            }));
          },
          enumerable: true
        });
      },
      finisher(clazz) {}
    };
  };
}

export {
  decorate,
  state
};
