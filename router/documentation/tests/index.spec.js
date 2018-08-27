import Router from '../../src/Router';

/* eslint-disable */
describe('@aofl/router/router', function() {
  before(function() {
    // reset history state
    this.historyState = [];
    sinon.stub(history, 'pushState', (stateObject, title, to) => {
      this.historyState.push(to);
    });

    let listeners = [];
    sinon.stub(window, 'addEventListener', (event, fn) => {
      listeners.push({event, fn});
    });

    sinon.stub(history, 'back', () => {
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].event === 'popstate') {
          this.historyState.pop();
          listeners[i].fn({preventDefault: () => {}});
          break;
        }
      }
    });
  });

  afterEach(function() {
    this.historyState = [];
    // history.pushState.reset();
    // addEventListener.reset();
    // history.back.reset();
  });

  context('Navigation', function() {
    beforeEach(function() {
      const routeConfig = [
        {
          'resolve': () => fetch('./routes/home/index.js'),
          'rotation': 'routes',
          'path': '/home'
        },
        {
          'resolve': () => fetch('./routes/about/index.js'),
          'rotation': 'routes',
          'path': '/about'
        },
        {
          'resolve': () => fetch('./routes/login/index.js'),
          'rotation': 'routes',
          'path': '/login'
        }
      ];

      this.router = new Router();
      this.router.init(routeConfig);
    });

    it('Should match "/home" route and navigate to it', function(done) {
      this.router.navigate('/home').then(() => {
        expect(this.historyState.slice(-1)[0]).to.equal('/home');
        done();
      });
    });

    it('Should not match "/" route and navigate to it', function(done) {
      this.router.navigate('/').then(() => {
        expect(this.historyState).to.have.lengthOf(0);
        done();
      });
    });

    it('Should not navigate to same path', function(done) {
      this.router.navigate(location.pathname).catch((e) => {
        expect(e).to.equal('Can\'t navigate to current path');
        done();
      });
    });

    it('Should redirect', function(done) {
      this.router.beforeEach((request, response, next) => {
        if (response.to === '/about') {
          response.to = '/login';
        }
        next(response);
      });

      this.router.navigate('/about').then(() => {
        expect(this.historyState.slice(-1)[0]).to.equal('/login');
        done();
      });
    });

    it('Should navigate back to the previous path', function(done) {
      this.router.navigate('/home').then(() => {
        setTimeout(() => {
          this.router.navigate('/about').then(() => {
            window.history.back();
            expect(this.historyState.slice(-1)[0]).to.equal('/home');
            this.router.removeListener();
            done();
          });
        })
      });
    });
  });

  context('Middleware', function() {
    beforeEach(function() {
      const routeConfig = [
        {
          'resolve': () => fetch('./routes/home/index.js'),
          'rotation': 'routes',
          'path': '/home'
        }
      ];

      this.router = new Router();
      this.router.init(routeConfig);
    });

    beforeEach(function() {
      this.beforeStub = sinon.stub();
      this.afterEachStub = sinon.stub();
    });

    beforeEach(function() {
      this.router.before((request, response, next) => {
        this.beforeStub();
        next(response);
      });
      this.router.afterEach((request, response, next) => {
        this.afterEachStub();
        next(response);
      });
    });

    it('Should have called before middleware', function(done) {
      this.router.navigate('/home').then(() => {
        expect(this.beforeStub.called).to.equal(true);
        done();
      });
    });

    it('Should have called afterEach middleware', function(done) {
      this.router.navigate('/home').then(() => {
        expect(this.afterEachStub.called).to.equal(true);
        done();
      });
    });
  });
});
