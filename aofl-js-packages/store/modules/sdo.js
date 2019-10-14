/**
 * @summary sdo
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {get} from '@aofl/object-utils';
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
   * @private
   */
  get state() {
    return this.storeInstance.getState()[this.namespace];
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
