/**
 * @summary store
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {RegisterCallback} from '@aofl/register-callback';
import {deepFreeze} from '@aofl/object-utils';

const TICK = Symbol('tick');
const MICRO_TASK = Symbol('microtask');

/**
  * Simple yet powerful implementation of flux type data store.
  *
  * @memberof module:@aofl/store
  */
class Store {
  /**
    * Creates an instance of Store.
    * @param {Boolean} debug
    */
  constructor(debug = false) {
    this.debug = debug;
    this.state = {};
    this.namespaces = {};
    this.registerCallback = new RegisterCallback();
    this[TICK] = null;

    this[MICRO_TASK] = () => {
      this.registerCallback.next();
      this[TICK] = null;
    };

    if (debug === true || /* istanbul ignore next */typeof window.aoflDevtools !== 'undefined') {
      this.debug = true;
      this.state = deepFreeze(this.state);
      /* istanbul ignore next */
      if (typeof window.aoflDevtools === 'undefined') {
        window.aoflDevtools = {};
      }
      /* istanbul ignore next */
      if (!Array.isArray(window.aoflDevtools.storeInstances)) {
        window
          .aoflDevtools
          .storeInstances = [];
      }
      window.aoflDevtools.storeInstances.push(this);
    }
  }
  /**
    * subscribe() register the callback function with registerCallback and returns
    * the unsubscribe function.
    *
    * @param {Furtion} callback
    * @return {Function}
    */
  subscribe(callback) {
    return this.registerCallback.register(callback);
  }
  /**
    * getState() return the current state.
    *
    * @return {Object}
    */
  getState() {
    return this.state;
  }

  getRedactedState() {
    const state = {};
    for (const key in this.namespaces) {
      /* istanbul ignore next */
      if (!Object.hasOwnProperty.call(this.namespaces, key)) continue;
      const sdo = this.namespaces[key];
      state[sdo.namespace] = sdo.redactedState;
    }
    return state;
  }
  /**
    *
    * @param {SDO} sdo
    */
  addState(sdo) {
    if (window.aofljsConfig.hot === true && typeof this.namespaces[sdo.namespace] !== 'undefined') {
      sdo.initialState = Object.assign(sdo.initialState ||
        sdo.constructor.initialState, this.namespaces[sdo.namespace].state);
    }
    /* istanbul ignore next */
    if (typeof this.namespaces[sdo.namespace] !== 'undefined' && window.aofljsConfig.hot !== true) {
      throw new Error(`${this.constructor.name}: Cannot redefine existing namespace ${sdo.namespace}`);
    }


    this.namespaces[sdo.namespace] = sdo;
    this.commit(sdo.namespace, sdo.initialState || sdo.constructor.initialState);
  }
  /**
    * Copies staged changes to state and notifies subscribers
    */
  commit(namespace, subState) {
    const state = Object.assign({}, this.state, {
      [namespace]: subState
    });
    this.replaceState(state);
  }
  /**
    * replaceState() take a state object, replaces the state property and notifies subscribers.
    *
    * @param {Object} state
    */
  replaceState(state) {
    this.state = state;
    if (this.debug) {
      this.state = deepFreeze(this.state);
    }
    this.dispatch();
  }

  /**
    * Resets the state to the initial state of Sdos.
    */
  flushState() {
    const state = {};
    for (const key in this.namespaces) {
      /* istanbul ignore next */
      if (!Object.hasOwnProperty.call(this.namespaces, key)) continue;
      const sdo = this.namespaces[key];
      state[sdo.namespace] = Object.assign({}, sdo.constructor.initialState);
    }
    this.replaceState(state);
  }
  /**
    * Batches all calls to dispatch and notifies subscribers on next tick.
    */
  dispatch() {
    if (this[TICK]) {
      return;
    }
    this[TICK] = setTimeout(this[MICRO_TASK]);
  }
}

export {
  Store
};
