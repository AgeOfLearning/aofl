/**
 * @summary sdo
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {get} from '@aofl/object-utils';
import {Store} from './store'; // eslint-disable-line
import {storeInstance as defaultStoreInstance} from './instance';

const storeProxy = Symbol('storeProxy');
const getStoreProxy = Symbol('getStoreProxy');
const defineDecorators = Symbol('defineDecorators');
const defineStateProperties = Symbol('defineStateProperties');

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
   * @memberof Sdo
   */
  constructor(initialState, storeInstance = defaultStoreInstance) {
    if (typeof this.constructor.initialState === 'undefined') {
      throw new Error(`${this.constructor.name}: Missing static property initialState.`);
    }

    if (typeof this.constructor.namespace === 'undefined') {
      throw new Error(`${this.constructor.name}: Missing static property namespace.`);
    }

    const proto = Object.getPrototypeOf(this);
    const properties = Object.getOwnPropertyDescriptors(proto);

    this.initialState = initialState || this.constructor.initialState;

    /** @type {String} */
    this.namespace = this.constructor.namespace;

    this[storeProxy] = this[getStoreProxy](storeInstance);
    this[defineStateProperties]();
    this[defineDecorators](properties);

    storeInstance.addState(this);
    this._storeInstance = storeInstance;
  }

  /**
   * @memberof Sdo
   * @type {Store}
   * @readonly
   */
  get storeInstance() {
    return this[storeProxy];
  }

  /**
   * @memberof Sdo
   * @type {Object}
   * @readonly
   */
  get state() {
    return this.storeInstance.getState();
  }
  /**
   * @memberof Sdo
   * @type {Object}
   * @readonly
   */
  get staged() {
    return this.storeInstance.getStaged();
  }
  /**
   *
   *
   * @memberof Sdo
   * @param {Store} storeInstance
   * @return {Proxy}
   */
  [getStoreProxy](storeInstance) {
    return new Proxy(storeInstance, {
      get: (target, prop) => {
        const value = Reflect.get(target, prop);

        if (prop === 'staged') {
          return value[this.namespace];
        } else if (prop === 'state') {
          return value[this.namespace];
        } else if (prop === 'stage') {
          return (key, state) => {
            return Reflect.apply(value, target, [
              this.namespace,
              Object.assign({}, this.state, {
                [key]: state
              })
            ]);
          };
        } else if (prop === 'commit') {
          return (key, state) => {
            return Reflect.apply(value, target, []);
          };
        }
        return value;
      }
    });
  }
  /**
   * @memberof Sdo
   *
   */
  [defineStateProperties]() {
    for (const key in this.initialState) {
      if (!this.initialState.hasOwnProperty(key)) continue;
      Object.defineProperties(this, {
        [key]: {
          get: () => {
            return this.state[key];
          },
          enumerable: true
        },
        [`set${key.charAt(0).toUpperCase()}${key.slice(1)}`]: {
          value: (value) => {
            this.storeInstance.stage(key, value);
            return this;
          },
          enumerable: true
        }
      });
    }
  }
  /**
   * @memberof Sdo
   * @param {Object} properties
   */
  [defineDecorators](properties) {
    for (const property in properties) {
      if (!properties.hasOwnProperty(property)) continue;
      if (property === 'namespace') continue;
      if (typeof properties[property].value === 'undefined' && typeof properties[property].set === 'undefined') {
        const getFn = Reflect.get(properties[property], 'get');
        Object.defineProperty(this, property, {
          get: () => { // eslint-disable-line
            const observedProperty = this.observedProperties[property];
            let changed = false;

            const state = this._storeInstance.getState();
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
              // console.log('computed....', property);
              this.observedProperties[property].value = Reflect.apply(getFn, this, []);
            }
            return this.observedProperties[property].value;
          }
        });
      }
    }
  }
  /**
   *
   *
   * @memberof Sdo
   * @param {Sdo} sdo
   * @return {Sdo}
   */
  switch(sdo) {
    return sdo;
  }
  /**
   *
   * @memberof Sdo
   */
  commit() {
    this.storeInstance.commit();
  }
}

export {
  Sdo
};
