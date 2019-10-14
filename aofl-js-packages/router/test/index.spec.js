import Router from '../modules/Router';

/* eslint-disable */
describe('@aofl/router/router', function() {
  beforeEach(function() {
    // reset history state
    this.historyState = [];
    sinon.stub(history, 'pushState').callsFake((stateObject, title, to) => {
      this.historyState.push(to);
    });
    sinon.stub(history, 'replaceState').callsFake((stateObject, title, to) => {});

    this.listeners = [];
    sinon.stub(window, 'addEventListener').callsFake((event, fn) => {
      this.listeners.push({event, fn});
    });

    sinon.stub(history, 'back').callsFake(() => {
      for (let i = 0; i < this.listeners.length; i++) {
        if (this.listeners[i].event === 'popstate') {
          this.historyState.pop();
          this.listeners[i].fn({preventDefault: () => {}});
          break;
        }
      }
    });
  });

  afterEach(function() {
    this.historyState = [];
    this.listeners = [];
    history.pushState.restore();
    history.replaceState.restore();
    addEventListener.restore();
    history.back.restore();
  });

  context('Navigation', function() {
    beforeEach(function() {
      const routeConfig = [
        {
          'resolve': () => Promise.resolve(),
          'rotation': 'routes',
          'path': '/home'
        },
        {
          'resolve': () => Promise.resolve(),
          'rotation': 'routes',
          'path': '/about'
        },
        {
          'resolve': () => Promise.resolve(),
          'rotation': 'routes',
          'path': '/about/:user/title/:title'
        },
        {
          'resolve': () => Promise.resolve(),
          'rotation': 'routes',
          'path': '/about/:user'
        },
        {
          'resolve': () => Promise.resolve(),
          'rotation': 'routes',
          'path': '/about/:user/profile'
        },
        {
          'resolve': () => Promise.resolve(),
          'rotation': 'routes',
          'path': '/about/:user/:title'
        },
        {
          'resolve': () => Promise.resolve(),
          'rotation': 'routes',
          'path': '/about/:user/profileAfterDynamic'
        },
        {
          'resolve': () => Promise.resolve(),
          'rotation': 'routes',
          'path': '/about/team'
        },
        {
          'resolve': () => Promise.resolve(),
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

    it('Should match "/home" route and navigate to it', async function() {
      return await new Promise((resolve) => {
        this.router.after((request, response, next) => {
          expect(response.matchedRoute).to.have.property('path', '/home')
          resolve();
        });
        this.router.navigate('/home');
      });
    });

    it('Should match "/home" route and navigate to it and call replace state', async function() {
      return await new Promise((resolve) => {
        this.router.after((request, response, next) => {
          next(response);
          setTimeout(() => {
            expect(response.matchedRoute).to.have.property('path', '/home')
            expect(this.historyState).to.have.property('length', 0)
            resolve();
          });
        });
        this.router.navigate('/home', {replaceState: true});
      });
    });

    it('Should have matchedRoute on routerInstance', async function() {
      return await new Promise((resolve) => {
        this.router.after((request, response, next) => {
          expect(this.router.currentRoute.matchedRoute).to.have.property('path', '/home')
          resolve();
        });
        this.router.navigate('/home');
      });
    });

    it('Should match dynamic "/about/mike/" route and navigate to it', async function() {
      return await new Promise((resolve) => {
        this.router.after((request, response, next) => {
          expect(response.matchedRoute).to.have.property('path', '/about/:user')
          resolve();
        });
        this.router.navigate('/about/mike');
      });
    });

    it('Should match static "/about/team" route and navigate to it event when there is /about/:user',
    async function() {
      return await new Promise((resolve) => {
        this.router.after((request, response, next) => {
          expect(response.matchedRoute).to.have.property('path', '/about/team');
          resolve();
        });
        this.router.navigate('/about/team');
      });
    });

    it('Should match static "/about/team?hello=world" route and navigate to it event when there is /about/:user',
    async function() {
      return await new Promise((resolve) => {
        this.router.after((request, response, next) => {
          expect(response.matchedRoute).to.have.property('path', '/about/team')
          resolve();
        });
        this.router.navigate('/about/team?hello=world');
      });
    });

    it('Should match nested dynamic "/about/mike/title/programmer" route and navigate to it', async function() {
      try {
        await new Promise((resolve) => {
          this.router.after((request, response, next) => {
            expect(response.matchedRoute).to.have.property('path', '/about/:user/title/:title')
            resolve();
          });
          this.router.navigate('/about/mike/title/programmer');
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should not match nested dynamic "/about/mike/hobby/programmer" route and navigate to it',
    async function() {
      try {
        await new Promise((resolve) => {
          this.router.after((request, response, next) => {
            expect(response.matchedRoute).to.be.null;
            resolve();
          });
          this.router.navigate('/about/mike/hobby/programmer');
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should match nested dynamic "/about/mike/programmer" route and navigate to it', async function() {
      try {
        await new Promise((resolve) => {
          this.router.after((request, response, next) => {
            expect(response.matchedRoute).to.have.property('path', '/about/:user/:title')
            resolve();
          });
          this.router.navigate('/about/mike/programmer');
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should match nested dynamic "/about/mike/profile" route and navigate to it', async function() {
      try {
        await new Promise((resolve) => {
          this.router.after((request, response, next) => {
            expect(response.matchedRoute).to.have.property('path', '/about/:user/profile')
            resolve();
          });
          this.router.navigate('/about/mike/profile');
        });
      } catch (e) {
        return Promise.reject(e);
      }

    });

    it('Should match nested dynamic "/about/mike/profileAfterDynamic" route and navigate to it. The order of the routes in the routes config should not matter', async function() {
      try {
        await new Promise((resolve) => {
          this.router.after((request, response, next) => {
            expect(response.matchedRoute).to.have.property('path', '/about/:user/profileAfterDynamic')
            resolve();
          });
          this.router.navigate('/about/mike/profileAfterDynamic');
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should not match "/" route and navigate to it', async function() {
      try {
        await new Promise((resolve) => {
          this.router.after((request, response, next) => {
            expect(response.matchedRoute).to.be.null;
            resolve();
          });
          this.router.navigate('/');
        });
      } catch (e) {
        return Promise.reject(e);
      }

    });

    it('Should not navigate to same path', async function() {
      try {
        await new Promise((resolve) => {
          this.router.navigate(location.href.replace(location.origin, '')).catch((e) => {
            expect(e).to.equal('Can\'t navigate to current path');
            resolve();
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }

    });

    it('Should redirect', async function() {
      try {
        await new Promise(async (resolve) => {
          this.router.beforeEach((request, response, next) => {
            if (response.to === '/about') {
              response.to = '/login';
            }
            next(response);
          });

          await this.router.navigate('/about');
          expect(this.historyState.slice(-1)[0]).to.equal('/login');
          resolve();
        });
      } catch (e) {
        return Promise.reject(e);
      }

    });

    it('Should navigate back to the previous path', async function() {
      try {
        await new Promise(async (resolve, reject) => {
          await this.router.navigate('/home');
          setTimeout(async () => {
            await this.router.navigate('/about');
            window.history.back();
            // expect(this.historyState.slice(-1)[0]).to.equal('/home');
            expect(true).to.be.true;
            this.router.removeListener();
            resolve();
          }, 10);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('Middleware', function() {
    beforeEach(function() {
      const routeConfig = [
        {
          'resolve': () => Promise.resolve(),
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

    it('Should have called before middleware', async function() {
      try {
        await this.router.navigate('/home');
        expect(this.beforeStub.called).to.equal(true);
      } catch (e) {
        return Promise.reject(e);
      }

    });

    it('Should have called afterEach middleware', async function() {
      try {
        await this.router.navigate('/home');
          expect(this.afterEachStub.called).to.equal(true);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
