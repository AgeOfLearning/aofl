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
  }

  /**
   *
   * @param {*} next
   * @return {Function}
   */
  subscribe(next) {
    return this.cbService.register(next);
  }

  /**
   * @return {Object}
   */
  getState() {
    return this.state;
  }

  /**
   *
   * @param {*} decorator
   */
  addDecorator(decorator) {
    this.decorators.push(decorator);
    this.commit(this.state);
  }

  /**
   *
   * @param {*} decorators
   */
  addDecorators(decorators) {
    this.decorators = this.decorators.concat(decorators);
    this.commit(this.state);
  }

  /**
   *
   * @param {*} state
   * @return {Object}
   * @private
   */
  __applyDecorators(state) {
    let nextState = state;
    for (let i = 0; i < this.decorators.length; i++) {
      nextState = this.decorators[i](nextState);
    }
    return nextState;
  }

  /**
   *
   * @param {*} nextState
   * @param {*} stateAlias
   */
  __execAsyncMutations(nextState, stateAlias) {
    let ns = this.namespaces;

    if (typeof stateAlias !== 'undefined' && this.namespaces.hasOwnProperty(stateAlias)) {
      ns = {
        [stateAlias]: this.namespaces[stateAlias]
      };
    }

    for (let key in ns) {
      if (!ns.hasOwnProperty(key)) continue;
      for (let mutationId in ns[key].asyncMutations) {
        if (!ns[key].asyncMutations.hasOwnProperty(mutationId)) continue;
        if (ns[key].asyncMutations[mutationId].condition(nextState)) {
          ns[key].asyncMutations[mutationId].method(nextState)
          .then((payload) => {
            this.commit([{
              stateAlias,
              mutationId,
              payload
            }]);
          });
        }
      }
    }
  }

  /**
   *
   * @param {*} mutations
   * @param {*} state
   * @return {Object}
   */
  __applyMutations(mutations, state) {
    let nextState = state;
    for (let i = 0; i < mutations.length; i++) {
      if (typeof this.namespaces[mutations[i].stateAlias] === 'undefined') continue;

      let mutation = mutations[i];
      let ns = this.namespaces[mutation.stateAlias];

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
   * @param {*} sdo
   * @param {*} payload
   */
  addState(sdo, payload) {
    if (this.namespaces.hasOwnProperty(sdo.alias)) return;

    this.namespaces[sdo.alias] = {
      namespace: sdo.namespace,
      mutations: sdo.mutations,
      asyncMutations: {}
    };

    if (sdo.hasOwnProperty('asyncMutations')) {
      this.namespaces[sdo.alias].asyncMutations = sdo.asyncMutations;
    }

    this.state = Object.assign({}, this.state, {
      [sdo.namespace]: sdo.mutations.init(payload)
    });

    if (Array.isArray(sdo.decorators)) {
      this.addDecorators(sdo.decorators);
    }
    this.__execAsyncMutations(this.state, sdo.alias);
  }

  /**
   *
   * @param {*} mutations
   * @param {*} forceCommit
   */
  commit(mutations, forceCommit = false) {
    let nextState = this.__applyMutations(mutations, this.state);

    if (nextState !== this.state) {
      nextState = this.__applyDecorators(nextState);
      this.__execAsyncMutations(nextState);
      this.state = nextState;

      if (this.debug) {
        this.state = deepFreeze(this.state);
      }

      this.cbService.next();
    }
  }

  /**
   *
   * @param {*} fn
   * @param {*} wait
   * @return {Function}
   */
  throttledDebounce(fn, wait) {
    let timeout = null;
    let execCount = 0;
    let execSeries = 0;

    return (...args) => {
      let execIndex = execCount++;
      let later = (execSeriesIndex) => {
        timeout = null;
        if (execIndex === execCount - 1 && execSeriesIndex === execSeries) {
          execCount = 0;
          execSeries++;
          if (execIndex > 0) {
            return fn(...args);
          }
        }
        return Promise.reject();
      };

      clearTimeout(timeout);
      return new Promise((resolve) => {
        timeout = setTimeout(() => {
          return later(execSeries).then(resolve);
        }, wait);

        if (execIndex === 0) {
          return fn(...args).then(resolve);
        }
      });
    };
  }
}

export default Store;
