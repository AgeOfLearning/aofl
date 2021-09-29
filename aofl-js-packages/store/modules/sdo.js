/**
 * @summary sdo
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {deepAssign, get} from '@aofl/object-utils';
 import {Store} from './store'; // eslint-disable-line
import {storeInstance as defaultStoreInstance} from './instance';

const defineDecorators = Symbol('defineDecorators');

/**
  * Sate Definition Object {Sdo} is a base class to define sub states of the store.
  *
  * @memberof module:@aofl/store
  */
class Sdo {
  /**
    * Creates an instance of Sdo.
    * @param {Object} initialState
    * @param {Store} [storeInstance=defaultStoreInstance]
    */
  constructor(initialState, storeInstance = defaultStoreInstance) {
    /* istanbul ignore next */
    if (typeof this.constructor.namespace === 'undefined') {
      throw new Error(`${this.constructor.name}: Missing static property namespace.`);
    }

    const proto = Object.getPrototypeOf(this);
    const properties = Object.getOwnPropertyDescriptors(proto);

    /** @type {String} */
    this.namespace = this.constructor.namespace;
    this.initialState = initialState;

    this.storeInstance = storeInstance;
    this[defineDecorators](properties);
  }

  /**
    * @type {Object}
    * @readonly
    */
  get state() {
    return this.storeInstance.getState()[this.namespace];
  }

  get redactedState() {
    const redact = this.constructor.redact;
    const state = {};

    for (const key in this.state) {
      if (!Object.prototype.hasOwnProperty.call(this.state, key)) continue;
      if (redact[key] === true) {
        state[key] = 'REDACTED';
      } else if (Array.isArray(redact[key])) {
        for (let i = 0; i < redact[key].length; i++) {
          const rkey = redact[key][i].split('.');
          const rname = rkey[rkey.length - 1];
          const path = rkey.slice(0, rkey.length - 1).join('.');
          if (path.length === 0) {
            state[key] = Object.assign({}, this.state[key], {[rname]: 'REDACTED'});
          } else {
            state[key] = deepAssign(this.state[key], path, {[rname]: 'REDACTED'});
          }
        }
      } else {
        state[key] = this.state[key];
      }
    }

    if (Array.isArray(this.constructor.redactPatterns)) {
      let stateJSON = JSON.stringify(state);
      for (let i = 0; i < this.constructor.redactPatterns.length; i++) {
        const pattern = this.constructor.redactPatterns[i];
        stateJSON = stateJSON.replaceAll(pattern, 'REDACTED');
      }
      return JSON.parse(stateJSON);
    }

    return state;
  }
  /**
    * Commits state to store.
    *
    * @param {Object} state
    */
  commit(state) {
    this.storeInstance.commit(this.namespace, state);
  }
  /**
    * Reset state to intital state
    */
  reset() {
    this.storeInstance.commit(this.namespace, this.constructor.initialState);
  }
  /**
    * subscribe() register the callback function with registerCallback and returns
    * the unsubscribe function.
    *
    * @param {Furtion} callback
    * @return {Function}
    */
  subscribe(callback) {
    return this.storeInstance.subscribe(callback);
  }
  /**
    * @private
    * @param {Object} properties
    */
  [defineDecorators](properties) {
    for (const property in properties) {
      /* istanbul ignore next */
      if (!Object.hasOwnProperty.call(properties, property)) continue;
      /* istanbul ignore next */
      if (property === 'namespace') continue;
      if (typeof properties[property].value === 'undefined' && typeof properties[property].set === 'undefined') {
        const getFn = Reflect.get(properties[property], 'get');
        Object.defineProperty(this, property, {
           get: () => { // eslint-disable-line
            const observedProperty = this.observedProperties[property];
            let changed = false;

            const state = this.storeInstance.getState();
            const newValues = [];
            for (let i = 0; i < observedProperty.keys.length; i++) {
              const key = observedProperty.keys[i];
              const value = observedProperty.values[i];
              const newValue = get(state, key);

              newValues.push(newValue);
              if (value !== newValue) {
                changed = true;
              }
            }
            observedProperty.values = newValues;

            if (changed) {
              this.observedProperties[property].value = Reflect.apply(getFn, this, []);
            }
            return this.observedProperties[property].value;
          }
        });
      }
    }
  }
}

export {
  Sdo
};
