import {RegisterCallback} from '@aofl/register-callback';
import {deepFreeze} from '@aofl/object-utils';

/**
 * Store is a built on the same principles as redux and attempts to simplify some of Redux's
 * concepts. It also incorporates ideas from other centralized state management implementations.
 *
 * @class
 * @summary store
 * @version 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
class Store {
  /**
   * Creates an instance of Store.
   * @memberof Store
   * @param {Boolean} debug
   */
  constructor(debug = false) {
    this.debug = debug;
    this.staged = {};
    this.state = {};
    this.namespaces = {};
    this.registerCallback = new RegisterCallback();

    if (debug === true || /* istanbul ignore next */typeof window.aoflDevtools !== 'undefined') {
      this.state = deepFreeze(this.state);
      window.aoflDevtools = window.aoflDevtools || {};
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
   * @memberof Store
   * @param {Furtion} callback
   * @return {Function}
   */
  subscribe(callback) {
    return this.registerCallback.register(callback);
  }
  /**
   * getState() return the current state.
   *
   * @memberof Store
   * @return {Object}
   */
  getState() {
    return this.state;
  }
  /**
   * returns staged changes
   *
   * @memberof Store
   * @return {Object}
   */
  getStaged() {
    return this.staged;
  }
  /**
   *
   * @memberof Store
   * @param {SDO} sdo
   */
  addState(sdo) {
    if (typeof this.namespaces[sdo.namespace] !== 'undefined') {
      throw new Error(`${this.constructor.name}: Cannot redefine existing namespace ${sdo.namespace}`);
    }

    this.namespaces[sdo.namespace] = sdo;
    this.stage(sdo.namespace, sdo.initialState).commit();
  }
  /**
   *
   * @memberof Store
   * @param {String} namespace
   * @param {Omjern} state
   * @return {Store}
   */
  stage(namespace, state) {
    this.staged = Object.assign({}, this.staged, {
      [namespace]: state
    });
    return this;
  }
  /**
   * Copies staged changes to state and notifies subscribers
   * @memberof Store
   */
  commit() {
    const state = Object.assign({}, this.staged);
    this.replaceState(state);
  }
  /**
   * replaceState() take a state object, replaces the state property and notifies subscribers.
   *
   * @memberof Store
   * @param {Object} state
   */
  replaceState(state) {
    this.state = state;
    if (this.debug) {
      this.state = deepFreeze(this.state);
    }
    this.registerCallback.next();
  }
  /**
   * Resets the state to the inital state of Sdos.
   * @memberof Store
   */
  flushState() {
    for (const key in this.namespaces) {
      if (!this.namespaces.hasOwnProperty(key)) continue;
      const sdo = this.namespaces[key];
      this.stage(sdo.namespace, Object.assign({}, sdo.constructor.initialState));
    }
    this.commit();
  }
}

export {
  Store
};
