/* eslint no-invalid-this: "off" */
import {expect} from 'chai';
import {Store} from '../modules/store';

describe('@aofl/store/store', function() {
  context('debug', function() {
    beforeEach( /** @this */ function() {
      this.storeInstance = new Store(true);
      this.storeInstance.addState({
        namespace: 'test',
        initialState: {
          count: 0
        }
      });
    });
    afterEach(/** @this */ function() {
      this.storeInstance = null;
    });

    it('Should add storeInstance to aoflDevtools', /** @this */function() {
      expect(window.aoflDevtools.storeInstances[0]).to.equal(this.storeInstance);
    });

    it('Should freeze state', /** @this */ function() {
      const badFn = () => {
        this.storeInstance.state.test.count = 1;
      };

      expect(badFn).to.throw;
    });
  });
});
