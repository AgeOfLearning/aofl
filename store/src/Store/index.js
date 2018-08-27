import {deepFreeze} from '@aofl/object-utils';
import {RegisterCallback} from '@aofl/register-callback';

/**
 *
 */
class Store {
  /**
   * @param {Boolean} debug
   */
  constructor(debug) {
    this.debug = debug;
    this.state = {};
    this.decorators = [];
    this.namespaces = {};
    this.cbService = new RegisterCallback();

    if (debug === true || typeof window.aoflDevtools !== 'undefined') {
      window.storeInstance = this;
    }
  }

  /**
   *
   * @param {Furtion} callback
   * @return {Function}
   */
  subscribe(callback) {
    return this.cbService.register(callback);
  }

  /**
   * @return {Object}
   */
  getState() {
    return this.state;
  }

  /**
   *
   * @param {Array} decorators
   */
  addDecorators(decorators) {
    this.decorators = this.decorators.concat(decorators);
    this.forceCommit();
  }

  /**
   *
   * @param {*} state
   * @return {Object}
   * @private
   */
  applyDecorators(state) {
    let nextState = state;
    for (let i = 0; i < this.decorators.length; i++) {
      nextState = this.decorators[i](nextState);
    }
    return nextState;
  }

  /**
   * @private
   * @param {Object} nextState
   */
  execAsyncMutations(nextState) {
    let ns = this.namespaces;
    for (let key in ns) {
      if (!ns.hasOwnProperty(key)) continue;
      for (let mutationId in ns[key].asyncMutations) {
        if (!ns[key].asyncMutations.hasOwnProperty(mutationId)) continue;
        if (ns[key].asyncMutations[mutationId].condition(nextState)) {
          ns[key].asyncMutations[mutationId].method(nextState)
          .then(function(mutationId, namespace, payload) {
            this.commit([{
              namespace,
              mutationId,
              payload
            }]);
          }.bind(this, mutationId, key))
          .catch(()=>{});
        }
      }
    }
  }

  /**
   *
   * @private
   * @param {Array} mutations
   * @param {Object} state
   * @return {Object}
   */
  applyMutations(mutations, state) {
    let nextState = state;
    for (let i = 0; i < mutations.length; i++) {
      if (typeof this.namespaces[mutations[i].namespace] === 'undefined') continue;

      let mutation = mutations[i];
      let ns = this.namespaces[mutation.namespace];

      if (mutation.async) {
        ns.asyncMutations[mutation.mutationId](nextState);
      } else {
        nextState = Object.assign({}, nextState, {
          [ns.namespace]: ns.mutations[mutation.mutationId](nextState[ns.namespace], mutation.payload)
        });
      }
    }

    return nextState;
  }

  /**
   *
   * @param {Object} sdo
   * @param {*} payload
   */
  addState(sdo, payload) {
    if (this.namespaces.hasOwnProperty(sdo.namespace)) return;

    this.namespaces[sdo.namespace] = {
      namespace: sdo.namespace,
      mutations: sdo.mutations,
      asyncMutations: {}
    };

    if (sdo.hasOwnProperty('asyncMutations')) {
      this.namespaces[sdo.namespace].asyncMutations = sdo.asyncMutations;
    }

    if (typeof this.state[sdo.namespace] === 'undefined') {
      this.state = Object.assign({}, this.state, {
        [sdo.namespace]: sdo.mutations.init(payload)
      });
    }

    if (Array.isArray(sdo.decorators)) {
      this.addDecorators(sdo.decorators);
    } else {
      this.forceCommit();
    }
  }

  /**
   *
   * @param {*} mutations
   * @param {*} forceCommit
   */
  commit(...mutations) {
    let nextState = this.applyMutations(mutations, this.state);

    if (nextState !== this.state) {
      nextState = this.applyDecorators(nextState);
      this.execAsyncMutations(nextState);
      this.replaceState(nextState);
    }
  }

  /**
   *
   * @param {*} forceCommit
   */
  forceCommit() {
    let nextState = this.state;
    nextState = this.applyDecorators(nextState);
    this.execAsyncMutations(nextState);
    this.replaceState(nextState);
  }


  /**
   *
   *
   * @param {Object} state
   * @memberof Store
   */
  replaceState(state) {
    this.state = state;
    if (this.debug) {
      this.state = deepFreeze(this.state);
    }
    this.cbService.next();
  }
}

export default Store;
