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
          'resolve': () => fetch('./routes/about/index.js'),
          'rotation': 'routes',
          'path': '/about/:user/title/:title'
        },
        {
          'resolve': () => fetch('./routes/about/index.js'),
          'rotation': 'routes',
          'path': '/about/:user'
        },
        {
          'resolve': () => fetch('./routes/about/index.js'),
          'rotation': 'routes',
          'path': '/about/:user/profile'
        },
        {
          'resolve': () => fetch('./routes/about/index.js'),
          'rotation': 'routes',
          'path': '/about/:user/:title'
        },
        {
          'resolve': () => fetch('./routes/about/index.js'),
          'rotation': 'routes',
          'path': '/about/:user/profileAfterDynamic'
        },
        {
          'resolve': () => fetch('./routes/about/index.js'),
          'rotation': 'routes',
          'path': '/about/team'
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

    afterEach(function() {
      this.router = null;
    });

    it('Should match "/home" route and navigate to it', function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.have.property('path', '/home')
        done();
      });
      this.router.navigate('/home');
    });

    it('Should match dynamic "/about/mike" route and navigate to it', function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.have.property('path', '/about/:user')
        done();
      });
      this.router.navigate('/about/mike');
    });

    it('Should match static "/about/team" route and navigate to it event when there is /about/:user',
    function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.have.property('path', '/about/team')
        done();
      });
      this.router.navigate('/about/team');
    });

    it('Should match static "/about/team?hello=world" route and navigate to it event when there is /about/:user',
    function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.have.property('path', '/about/team')
        done();
      });
      this.router.navigate('/about/team?hello=world');
    });

    it('Should match nested dynamic "/about/mike/title/programmer" route and navigate to it', function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.have.property('path', '/about/:user/title/:title')
        done();
      });
      this.router.navigate('/about/mike/title/programmer');
    });

    it('Should not match nested dynamic "/about/mike/hobby/programmer" route and navigate to it',
    function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.be.null;
        done();
      });
      this.router.navigate('/about/mike/hobby/programmer');
    });

    it('Should match nested dynamic "/about/mike/programmer" route and navigate to it', function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.have.property('path', '/about/:user/:title')
        done();
      });
      this.router.navigate('/about/mike/programmer');
    });

    it('Should match nested dynamic "/about/mike/profile" route and navigate to it', function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.have.property('path', '/about/:user/profile')
        done();
      });
      this.router.navigate('/about/mike/profile');
    });

    it('Should match nested dynamic "/about/mike/profileAfterDynamic" route and navigate to it. The order of the routes in the routes config should not matter', function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.have.property('path', '/about/:user/profileAfterDynamic')
        done();
      });
      this.router.navigate('/about/mike/profileAfterDynamic');
    });

    it('Should not match "/" route and navigate to it', function(done) {
      this.router.after((request, response, next) => {
        expect(response.matchedRoute).to.be.null;
        done();
      });
      this.router.navigate('/');
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
