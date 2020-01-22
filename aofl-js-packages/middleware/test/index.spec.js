/* eslint no-invalid-this: "off" */
import {Middleware} from '../modules/middleware';
import {expect} from 'chai';
import sinon from 'sinon';

describe('@aofl/middleware', function() {
  beforeEach(function() {
    this.mw = new Middleware('before', 'after');
    this.beforeStub = sinon.stub();
    this.afterStub = sinon.stub();
    this.beforeMW = (request, response, next) => {
      this.beforeStub();
      next(response);
    };
    this.afterMW = (request, response, next) => {
      this.afterStub();
      next(response);
    };
    this.unsubBefore = this.mw.use(this.beforeMW, 'before');
    this.unsubAfter = this.mw.use(this.afterMW, 'after');
  });

  afterEach(function() {
    this.mw = null;
    this.beforeStub.reset();
    this.afterStub.reset();
  });

  context('Registering and calling', function() {
    it('Should register middleware', function() {
      expect(this.mw.middleware.before).to.have.lengthOf(1);
      expect(this.mw.middleware.after).to.have.lengthOf(1);
    });

    it('Should call before middleware', async function() {
      try {
        await this.mw.iterateMiddleware({}, 'before');
        expect(this.beforeStub.called).to.equal(true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should call after middleware', async function() {
      try {
        await this.mw.iterateMiddleware({}, 'after');
        expect(this.afterStub.called).to.equal(true);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('Unsubscribe and calling', function() {
    beforeEach(function() {
      this.unsubBefore();
      this.unsubAfter();
    });

    it('Should call before middleware', async function() {
      try {
        await this.mw.iterateMiddleware({}, 'before');
        expect(this.beforeStub.called).to.be.false;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should call after middleware', async function() {
      try {
        await this.mw.iterateMiddleware({}, 'after');
        expect(this.afterStub.called).to.be.false;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Calling unsubscribe twice should not have any effect', async function() {
      try {
        this.unsubAfter();
        await this.mw.iterateMiddleware({}, 'after');
        expect(this.afterStub.called).to.be.false;
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('Enforcement and errors', function() {
    it('Should throw an error when registering w/invalid hook', function() {
      try {
        this.mw.use(this.afterMW, 'BadHook');
      } catch (e) {
        expect(e).to.not.equal(null);
        expect(e).to.match(/Error: Only before,after hooks are supported./);
      }
    });

    it('Should throw an error when registering non function middleware', function() {
      try {
        this.mw.use({}, 'BadHook');
      } catch (e) {
        expect(e).to.not.equal(null);
        expect(e).to.match(/Error: callback must be a function/);
      }
    });
  });
});
