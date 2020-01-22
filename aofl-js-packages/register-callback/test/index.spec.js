/* eslint no-invalid-this: "off" */
import {RegisterCallback} from '../modules/register-callback';
import {expect} from 'chai';
import sinon from 'sinon';

describe('@aofl/register-callback/src/register-callback', function() {
  beforeEach(function() {
    this.rc = new RegisterCallback();
  });

  it('should have property callbacks with next[] and error[]', function() {
    expect(this.rc).to.have.property('callbacks').that.is.an('array');
  });


  context('register()', function() {
    it('should return a function', function() {
      const unsubscribe = this.rc.register(() => {}, () => {});
      expect(unsubscribe).to.be.a('function');
    });

    it('should remove the cb function if the return function is executed', function() {
      const unsubscribe = this.rc.register(() => {}, () => {});
      unsubscribe();
      expect(this.rc.callbacks).to.have.property('length', 0);
    });

    it('the returned function should have no effect if executed multiple times', function() {
      this.rc.register(() => {});
      const unsubscribe = this.rc.register(() => {});
      unsubscribe();
      unsubscribe();
      expect(this.rc.callbacks).to.have.property('length', 1);
    });
  });

  context('next()', function() {
    it('should invoke all next functions', function() {
      const nextSpy = sinon.spy();
      this.rc.register(nextSpy);
      this.rc.next();

      expect(nextSpy.calledOnce).to.be.true;
    });
  });
});
