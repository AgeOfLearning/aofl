import {deepFreeze} from '@aofl/object-utils';
import {RegisterCallback} from '@aofl/register-callback';

/**
 * Store is a built on the same principles as redux and attempts to simplify some of Redux's
 * concepts. It also incorporates ideas from other centralized state management implementations.
 *
 * @summary store
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @memberof module:aofl-js/store-package
 *
 * @requires module:aofl-js/object-utils-package
 * @requires module:aofljs/register-callback
 */
class Store {
  /**
   * Creates an instance of Store.
   * @param {Boolean} debug
   */
  constructor(debug) {
    this.debug = debug;
    this.state = {};
    this.decorators = [];
    this.namespaces = {};
    this.registerCallbackInstance = new RegisterCallback();
    this.pending = {
      any: false
    };

    if (debug === true || /* istanbul ignore next */typeof window.aoflDevtools !== 'undefined') {
      this.state = deepFreeze(this.state);
      window.storeInstance = this;
    }
  }

  /**
   * subscribe() register the callback function with registerCallbackInstance and returns
   * the unsubscribe function.
   *
   * @param {Furtion} callback
   * @return {Function}
   */
  subscribe(callback) {
    return this.registerCallbackInstance.register(callback);
  }

  /**
   * getState() return the current state.
   *
   * @return {Object}
   */
  getState() {
    return this.state;
  }


  /**
   * setPending() updates the pending state of store when an async operation is in process.
   *
   * @private
   * @param {String} namespace
   * @param {String} mutationId
   * @param {Boolean} status
   */
  setPending(namespace, mutationId, status = true) {
    this.pending[namespace][mutationId] = status;

    const setPendingAny = (obj, root = false) => {
      let anyPending = false;
      for (let key in obj) {
        /* istanbul ignore next */
        if (key === 'any' || !obj.hasOwnProperty(key)) continue;
        if (obj[key] === true || (root && obj[key].any === true)) {
          anyPending = true;
          break;
        }
      }
      obj.any = anyPending;
    };

    setPendingAny(this.pending[namespace]);
    setPendingAny(this.pending, true);
  }

  /**
   * addDecorators() adds an array decorators to the docorators list and calls forceCommit to
   * invoke the newly added decorators.
   *
   * @param {Array} decorators
   */
  addDecorators(decorators) {
    this.decorators = this.decorators.concat(decorators);
    this.forceCommit();
  }

  /**
   * applyDecorators() loops through the decorators array and executes each decorator against the
   * modified state.
   *
   * @private
   * @param {Object} state
   * @return {Object}
   */
  applyDecorators(state) {
    let nextState = state;
    for (let i = 0; i < this.decorators.length; i++) {
      nextState = this.decorators[i](nextState);
    }
    return nextState;
  }

  /**
   * execAsyncMutations() loops through the asyncMutations and invokes the condition function of
   * each asyncMutation. It only ivokes the method if the condition evaluates to true.
   *
   * @private
   * @param {Object} nextState
   */
  execAsyncMutations(nextState) {
    let ns = this.namespaces;
    for (let key in ns) {
      /* istanbul ignore next  */
      if (!ns.hasOwnProperty(key)) continue;
      for (let mutationId in ns[key].asyncMutations) {
        /* istanbul ignore next  */
        if (!ns[key].asyncMutations.hasOwnProperty(mutationId)) continue;
        if (ns[key].asyncMutations[mutationId].condition(nextState)) {
          this.setPending(key, mutationId, true);
          ns[key].asyncMutations[mutationId].method(nextState)
          .then(function(mutationId, namespace, payload) {
            this.setPending(key, mutationId, false);
            this.commit({
              namespace,
              mutationId,
              payload
            });
            this.setPending(key, mutationId, false);
          }.bind(this, mutationId, key))
          .catch(/* istanbul ignore next  */() => {
            this.setPending(key, mutationId, false);
          });
        }
      }
    }
  }

  /**
   * applyMutations() loops through the mutations array and executes each mutation funcion against
   * the subState.
   *
   * @private
   * @param {Array} mutations
   * @param {Object} state
   * @return {Object}
   */
  applyMutations(mutations, state) {
    let nextState = state;
    for (let i = 0; i < mutations.length; i++) {
      if (typeof this.namespaces[mutations[i].namespace] === 'undefined') {
        throw new TypeError(`${mutations[i].namespace} is not a valid namespace`);
      };

      let mutation = mutations[i];
      let ns = this.namespaces[mutation.namespace];

      nextState = Object.assign({}, nextState, {
        [ns.namespace]: ns.mutations[mutation.mutationId](nextState[ns.namespace], mutation.payload)
      });
    }

    return nextState;
  }

  /**
   * addState() adds an sdo to the store and invokes the SDO.mutations.init() method to set the
   * initial state of the sub-state. Additionaly a payload can be supplied to the init funciton
   * to instantiate the sub-state with a modifed inital state.
   *
   * @param {Object} sdo
   * @param {*} payload
   */
  addState(sdo, payload) {
    if (typeof this.namespaces[sdo.namespace] !== 'undefined') return;

    this.namespaces[sdo.namespace] = {
      namespace: sdo.namespace,
      mutations: sdo.mutations,
      asyncMutations: {}
    };

    if (sdo.hasOwnProperty('asyncMutations')) {
      this.namespaces[sdo.namespace].asyncMutations = sdo.asyncMutations;
      this.pending[sdo.namespace] = Object.keys(sdo.asyncMutations).reduce((acc, item) => {
        acc[item] = false;
        return acc;
      }, {any: false});
    }

    this.state = Object.assign({}, this.state, {
      [sdo.namespace]: sdo.mutations.init(payload)
    });

    if (Array.isArray(sdo.decorators)) {
      this.addDecorators(sdo.decorators);
    } else {
      this.forceCommit();
    }
  }

  /**
   * commit() accepts variadit mutation objects as arguments and applies the mutations agains the
   * current state to generate the next state of the application.
   *
   * @param {*} mutations
   * @param {*} forceCommit
   * @throws {TypeError}
   */
  commit(...mutations) {
    if (mutations.length === 0) {
      throw new TypeError('Failed to execute \'commit\' on \'Store\': at least 1 argument required, but only 0 present.');
    }

    let nextState = this.applyMutations(mutations, this.state);

    /* istanbul ignore next */
    if (nextState !== this.state) {
      nextState = this.applyDecorators(nextState);
      this.execAsyncMutations(nextState);
      this.replaceState(nextState);
    }
  }

  /**
   * forceCommit() applies decorators and asyncMutations against the current state and executes
   * subscribed callback functions even if state did not change.
   */
  forceCommit() {
    let nextState = this.state;
    nextState = this.applyDecorators(nextState);
    this.execAsyncMutations(nextState);
    this.replaceState(nextState);
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

    this.registerCallbackInstance.next();
  }
}

export default Store;
