import PathUtils from '../path-utils';
import {Middleware} from '@aofl/middleware';
import matchRouteMiddleware from '../match-route-middleware';
import redirectMiddleware from '../redirect-middleware';

/**
 * @summary router
 * @version 1.0.0
 * @extends Middleware
 * @memberof module:aofl-js/router-package
 *
 * @requires module:aofl-js/router-package/src/path-utils
 * @requires module:aofl-js/middleware-package
 * @requires module:aofl-js/router-package/src/match-route-middleware
 * @requires module:aofl-js/router-package/src/redirect-middleware
 * @requires module:aofl-js/router-package/src/update-state-middleware
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
class Router {
  /**
   * @description Loads route config
   * @return {void}
   */
  constructor() {
    Object.defineProperties(this, {
      middleware: {
        value: new Middleware('before', 'after', 'afterEach', 'beforeEach')
      },
      resolve: {
        writable: true
      },
      currentRoute: {
        writable: true
      }
    });
  }

  /**
   *
   * @param {Array} config
   * @return {void}
   */
  init(config) {
    this.config = {
      routes: this.addRegexRoutes(config)
    };

    this.beforeEach(matchRouteMiddleware(this));
    this.afterEach(redirectMiddleware(this));

    this.removeListener = this.listen();
  }

  /**
   *
   * @param {Function} fn
   * @return {void}
   */
  before(fn) {
    return this.middleware.use(fn, 'before');
  }

  /**
   *
   * @param {Function} fn
   * @return {void}
   */
  after(fn) {
    return this.middleware.use(fn, 'after');
  }

  /**
   * @description Registers a post middleware function
   * @param {Function} fn
   * @return {void}
   */
  afterEach(fn) {
    return this.middleware.use(fn, 'afterEach');
  }

  /**
   * @description Registers a pre middle function
   * @param {Function} fn
   * @return {void}
   */
  beforeEach(fn) {
    return this.middleware.use(fn, 'beforeEach');
  }

  /**
   * @description Runs all middleware
   * @param {Object} request
   */
  async applyMiddleware(request) {
    const beforeEachResponse = await this.middleware.iterateMiddleware(request, 'beforeEach', Object.assign({}, request));
    await this.middleware.iterateMiddleware(request, 'afterEach', Object.assign({}, beforeEachResponse));
    const afterResponse = await this.middleware.iterateMiddleware(request, 'after', Object.assign({}, beforeEachResponse));

    if (!request.meta.poppedState) {
      if (request.meta.replaceState) {
        window.history.replaceState(null, null, afterResponse.to);
      } else {
        window.history.pushState(null, null, afterResponse.to);
      }
    }

    this.resolve();
  }

  /**
   * @description Adds regex version of routes for dynamic routing
   * @param {Object} routes
   * @return {Object}
   */
  addRegexRoutes(routes) {
    for (let i = 0; i < routes.length; i++) {
      const {regex, parse} = PathUtils.getRegex(routes[i].path);
      routes[i] = Object.assign({}, routes[i], {
        regex,
        parse
      });
    }
    return routes;
  }

  /**
   * @description Listens to changes on history
   * @return {Function}
   */
  listen() {
    const popStateHandler = (e) => {
      e.preventDefault();
      this.navigate(location.href.replace(location.origin, ''), {
        forceReload: true,
        poppedState: true
      });
    };
    window.addEventListener('popstate', popStateHandler);
    return () => {
      window.removeEventListener('popstate', popStateHandler);
    };
  }

  /**
   * @description public method which attempts to load the given path
   * @param {String} path
   * @param {Object} meta
   * @return {Promise}
   */
  navigate(path, _meta) {
    const meta = Object.assign({poppedState: false, forceReload: false, replaceState: false}, _meta);

    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      const request = {
        to: path,
        from: this.currentRoute? this.currentRoute.to: document.referrer,
        routes: this.config.routes,
        meta
      };
      if (path !== location.href.replace(location.origin, '') || meta.forceReload) {
        this.middleware.iterateMiddleware(request, 'before', Object.assign({}, request))
          .then(() => {
            this.applyMiddleware(request);
          });
      } else {
        reject('Can\'t navigate to current path');
      }
    });
  }
}

export default Router;
