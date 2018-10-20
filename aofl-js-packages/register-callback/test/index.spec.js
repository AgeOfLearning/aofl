/* eslint no-invalid-this: "off" */
import {RegisterCallback} from '../';

describe('@aofl/register-callback/src/register-callback', function() {
  beforeEach(function() {
    this.rc = new RegisterCallback();
  });

  it('should have property callbacks with next[] and error[]', function() {
    expect(this.rc).to.have.property('callbacks').to.have.all.keys('next', 'error');
  });

  context('addCb()', function() {
    it('should add next to callbacks.next', function() {
      this.rc.addCb('next', () => {});

      expect(this.rc.callbacks.next).to.have.property('length', 1);
    });

    it('should add error to callbacks.error', function() {
      this.rc.addCb('error', () => {});

      expect(this.rc.callbacks.error).to.have.property('length', 1);
    });

    it('should add the same next function once', function() {
      const next = () => {};
      this.rc.addCb('next', next);
      this.rc.addCb('next', next);

      expect(this.rc.callbacks.next).to.have.property('length', 1);
    });

    it('should add the same error function once', function() {
      const error = () => {};
      this.rc.addCb('error', error);
      this.rc.addCb('error', error);

      expect(this.rc.callbacks.error).to.have.property('length', 1);
    });
  });

  context('removeCb()', function() {
    beforeEach(function() {
      this.next = () => {};
      this.error = () => {};
      this.rc.addCb('next', this.next);
      this.rc.addCb('error', this.error);
    });

    it('should remove an existing next function', function() {
      this.rc.removeCb('next', this.next);
      expect(this.rc.callbacks.next).to.have.property('length', 0);
    });

    it('should have no effect if removing a function that is not in the next list', function() {
      this.rc.removeCb('next', () => {});
      expect(this.rc.callbacks.next).to.have.property('length', 1);
    });
  });

  context('register()', function() {
    before(function() {
      sinon.spy(RegisterCallback.prototype, 'addCb');
      sinon.spy(RegisterCallback.prototype, 'removeCb');
    });

    afterEach(function() {
      RegisterCallback.prototype.addCb.reset();
    });

    it('should invoke addCb() if next is a function', function() {
      this.rc.register(() => {});
      expect(this.rc.addCb.called).to.be.true;
    });

    it('should not invoke addCb() if next is not function', function() {
      this.rc.register('');
      expect(this.rc.addCb.called).to.be.false;
    });

    it('should invoke addCb() if error is a function', function() {
      this.rc.register('', () => {});
      expect(this.rc.addCb.called).to.be.true;
    });

    it('should invoke addCb() twice if next and error are functions', function() {
      this.rc.register(() => {}, () => {});
      expect(this.rc.addCb.calledTwice).to.be.true;
    });


    it('should return a function', function() {
      const unsubscribe = this.rc.register(() => {}, () => {});
      expect(unsubscribe).to.be.a('function');
    });

    it('should remove the next function if the return function is executed', function() {
      const unsubscribe = this.rc.register(() => {}, () => {});
      unsubscribe();
      expect(this.rc.callbacks.next).to.have.property('length', 0);
    });

    it('should remove the error function if the return function is executed', function() {
      const unsubscribe = this.rc.register(() => {}, () => {});
      unsubscribe();
      expect(this.rc.callbacks.error).to.have.property('length', 0);
    });

    it('the returned function should have no effect if executed multiple times', function() {
      this.rc.register(() => {}, () => {});
      const unsubscribe = this.rc.register(() => {}, () => {});
      unsubscribe();
      unsubscribe();
      expect(this.rc.callbacks.next).to.have.property('length', 1);
      expect(this.rc.callbacks.error).to.have.property('length', 1);
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

  context('error()', function() {
    it('should invoke all error functions', function() {
      const errorSpy = sinon.spy();
      this.rc.register('', errorSpy);
      this.rc.error();

      expect(errorSpy.calledOnce).to.be.true;
    });
  });
});
