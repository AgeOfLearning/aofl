/* eslint no-invalid-this: "off" */
import Store from '../modules/legacy/store';
import {deepAssign} from '@aofl/object-utils';

describe('@aofl/store/src/store', function() {
  beforeEach(function() {
    this.storeInstance = new Store();
  });

  afterEach(function() {
    this.storeInstance = null;
  });

  context('SDO with namespace and mutations', function() {
    beforeEach(function() {
      this.sdo = {
        namespace: 'unit-test',
        mutations: {
          init() {
            return {
              key: '',
              name: ''
            };
          },
          updateKey(subState, key) {
            return Object.assign({}, subState, {
              key
            });
          },
          updateName(subState, name) {
            return Object.assign({}, subState, {
              name
            });
          }
        }
      };

      this.storeInstance.addState(this.sdo);
    });

    it('should have a sub-state called "unit-test"', function() {
      expect(this.storeInstance.state).to.have.all.keys('unit-test');
    });

    it('should not add sub-state that already exist or have the same name as Object properties', function() {
      const sdo = {
        namespace: 'hasOwnProperty',
        mutations: {
          init() {
            return {};
          }
        }
      };
      this.storeInstance.addState(sdo);
      expect(this.storeInstance.state).to.not.have.any.keys('hasOwnProperty');
    });

    it('should update the state when invoked with a mutation object', function() {
      this.storeInstance.commit({
        namespace: 'unit-test',
        mutationId: 'updateKey',
        payload: 'hello'
      });

      expect(this.storeInstance.state['unit-test']).to.have.property('key', 'hello');
    });

    it('should throw a TypeError when called without any arguments', function() {
      expect(this.storeInstance.commit).to.throw(TypeError);
    });

    it('should throw a TypeError namespace does not exist', function() {
      const errorFn = () => {
        this.storeInstance.commit({
          namespace: '',
          mitationId: ''
        });
      };
      expect(errorFn).to.throw(TypeError);
    });

    it('should invoke the callback function when a mutation happens', function() {
      const spy = sinon.spy();
      this.storeInstance.subscribe(spy);
      this.storeInstance.commit({
        namespace: 'unit-test',
        mutationId: 'updateKey',
        payload: 'hello'
      });

      expect(spy.calledOnce).to.be.true;
    });

    it('forceCommit() should invoke the callback function', function() {
      const spy = sinon.spy();
      this.storeInstance.subscribe(spy);
      this.storeInstance.forceCommit();

      expect(spy.calledOnce).to.be.true;
    });

    it('replaceState() to replace the state with the supplied object', function() {
      const state = {};
      this.storeInstance.replaceState(state);
      expect(this.storeInstance.state).to.eql(state);
    });
  });

  context('SDO with namespace, mutations, decorators, asyncMutations', function() {
    beforeEach(function() {
      this.sdo = {
        namespace: 'unit-test',
        mutations: {
          init() {
            return {
              key: '',
              name: '',
              rejectAsync: ''
            };
          },
          updateKey(subState, key) {
            return Object.assign({}, subState, {
              key
            });
          },
          updateName(subState, name) {
            return Object.assign({}, subState, {
              name
            });
          },
          updateRejectAsync(subState, rejectAsync) {
            return Object.assign({}, subState, {
              rejectAsync
            });
          }
        },
        decorators: [
          (_nextState) => {
            let nextState = _nextState;
            const state = this.storeInstance.getState();

            if (
              typeof _nextState['unit-test'].$key === 'undefined' ||
              state['unit-test'].key !== _nextState['unit-test'].key
            ) {
              nextState = deepAssign(_nextState, 'unit-test', {
                $key: 'decorated ' + _nextState.key
              });
            }

            return nextState;
          }
        ],
        asyncMutations: {
          updateName: {
            condition: (nextState) => {
              const state = this.storeInstance.getState();
              return nextState['unit-test'].key !== state['unit-test'].key;
            },
            method() {
              return new Promise((resolve) => {
                setTimeout(() => {
                  return resolve('Async Name');
                }, 10);
              });
            }
          },
          updateRejectAsync: {
            condition: (nextState) => {
              const state = this.storeInstance.getState();
              return nextState['unit-test'].key !== state['unit-test'].key;
            },
            method() {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  return reject();
                }, 10);
              });
            }
          }
        }
      };

      sinon.spy(this.sdo.asyncMutations.updateName, 'condition');
      sinon.spy(this.sdo.asyncMutations.updateName, 'method');
      sinon.spy(this.sdo.asyncMutations.updateRejectAsync, 'condition');
      sinon.spy(this.sdo.asyncMutations.updateRejectAsync, 'method');
      this.storeInstance.addState(this.sdo);
    });

    it('Should process the decorators', function() {
      expect(this.storeInstance.state['unit-test'].$key).to.not.be.undefined;
    });

    it('should process asyncMutations', function() {
      expect(this.sdo.asyncMutations.updateName.condition.calledOnce).to.be.true;
    });

    it('should invoke asyncMutations method', async function() {
      try {
        await new Promise((resolve, reject) => {
          this.storeInstance.subscribe(() => {
            if (this.storeInstance.pending.any === false) {
              try {
                expect(this.sdo.asyncMutations.updateName.method.calledOnce).to.be.true;
                expect(this.storeInstance.state['unit-test']).to.have.property('name', 'Async Name');
                resolve();
              } catch (e) {
                reject(e);
              }
            }
          });

          this.storeInstance.commit({
            namespace: 'unit-test',
            mutationId: 'updateKey',
            payload: 'newKey'
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should notify subscribers when async mutation fails', async function() {
      try {
        await new Promise((resolve, reject) => {
          this.storeInstance.subscribe(() => {
            if (this.storeInstance.pending.any === false) {
              try {
                expect(this.sdo.asyncMutations.updateRejectAsync.method.calledOnce).to.be.true;
                resolve();
              } catch (e) {
                reject(e);
              }
            }
          });

          this.storeInstance.commit({
            namespace: 'unit-test',
            mutationId: 'updateKey',
            payload: 'newKey'
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('debug', function() {
    beforeEach(function() {
      this.debugStoreInstance = new Store(true);
    });

    afterEach(function() {
      this.debugStoreInstance = null;
    });

    it('should assign storeInstance to global variable', function() {
      expect(window.aoflDevtools).to.have.property('storeInstances');
    });

    it('should call deepFreeze on state', function() {
      expect(Object.isFrozen(this.debugStoreInstance.state)).to.be.true;
    });

    it('replaceState() call deepFreeze on state', function() {
      this.debugStoreInstance.replaceState({});
      expect(Object.isFrozen(this.debugStoreInstance.state)).to.be.true;
    });
  });
});
