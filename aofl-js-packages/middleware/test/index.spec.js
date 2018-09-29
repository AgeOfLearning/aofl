import Middleware from '../src/Middleware';

/* eslint-disable */
describe('@aofl/middleware', function() {
  before(function() {
    this.mw = new Middleware('before', 'after');
  });

  beforeEach(function() {
    this.beforeStub = sinon.stub();
    this.afterStub = sinon.stub();
    this.beforeMW = (request, response, next) => {
      this.beforeStub();
      next(response);
    }
    this.afterMW = (request, response, next) => {
      this.afterStub();
      next(response);
    }
    this.mw.use(this.beforeMW, 'before');
    this.mw.use(this.afterMW, 'after');
  });

  context('Registering and calling', function() {
    it('Should register middleware', function() {
      expect(this.mw.middleware['before']).to.have.lengthOf(1);
      expect(this.mw.middleware['after']).to.have.lengthOf(1);
    });

    it('Should call before middleware', function(done) {
      this.mw.iterateMiddleware({}, 'before').then(() => {
        expect(this.beforeStub.called).to.equal(true);
        done();
      });
    });

    it('Should call after middleware', function(done) {
      this.mw.iterateMiddleware({}, 'after').then(() => {
        expect(this.afterStub.called).to.equal(true);
        done();
      });
    });
  });

  context('Enforcement and errors', function() {
    it('Should throw an error when registering w/invalid hook', function() {
      try {
        this.mw.use(this.afterMW, 'BadHook');
      } catch(e) {
        expect(e).to.not.equal(null);
        expect(e).to.match(/Error: Only before,after hooks are supported./);
      }
    });

    it('Should throw an error when registering non function middleware', function() {
      try {
        this.mw.use({}, 'BadHook');
      } catch(e) {
        expect(e).to.not.equal(null);
        expect(e).to.match(/Error: callback must be a function/);
      }
    });
  });

  afterEach(function() {
    this.beforeStub.reset();
    this.afterStub.reset();
  });
});
