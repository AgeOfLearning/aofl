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
    /* istanbul ignore next */
    if (args.length === 0) {
      throw new TypeError('@aofl/store#decorate requires at least 1 argument, but only 0 were passed');
    }
    descriptor.finisher = (clazz) => {
      /* istanbul ignore else */
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

const StateOptionsDeclaration = {
  redact: [],
};
/**
 * Proxies state properties to store and converts instance properties to getters that return
 * values from store.
 *
 * @memberof module:@aofl/store
 * @param {Object} options
 * @param {Boolean|String|RegExp[]} options.redact
 * @return {Object}
 */
function state(options = StateOptionsDeclaration) {
  return (descriptor) => {
    const key = descriptor.key;
    return {
      kind: 'field',
      key: Symbol(),
      placement: 'own',
      descriptor: {},
      initializer() {
        const val = descriptor.initializer.call(this);
        /* istanbul ignore else */
        if (typeof this.constructor.initialState === 'undefined') {
          this.constructor.initialState = {};
        }
        /* istanbul ignore else */
        if (typeof this.constructor.initialState[key] === 'undefined') {
          this.constructor.initialState[key] = val;
        }
        if (typeof options.redact !== 'undefined') {
          /* istanbul ignore else */
          if (typeof this.constructor.redact === 'undefined') {
            this.constructor.redact = {};
          }
          /* istanbul ignore else */
          if (typeof this.constructor.redact[key] === 'undefined') {
            this.constructor.redact[key] = options.redact;
          }
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
