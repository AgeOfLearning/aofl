/**
 * @summary router
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import PathUtils from '../path-utils';
import {Middleware} from '@aofl/middleware';
import matchRouteMiddleware from '../match-route-middleware';
import {redirectMiddleware} from '../redirect-middleware';


/**
 * A client side router that uses history api and implements a middleware. This router
 * implementation is minimal yet very powerful. It will match routes and handles
 * redirects out of the box. Everything else can be programmed using an appropriate
 * middleware function.
 *
 * @memberof module:@aofl/router
 */
class Router {
  /**
   * Create an instance of Router
   */
  constructor() {
    this.removeMatchRouteMiddleware = () => {};
    this.removeRedirectMiddleware = () => {};
    this.removeListener = () => {};

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
   * Loads rotes config
   * @param {Array} config
   * @return {void}
   */
  init(config) {
    this.config = {
      routes: this.addRegexRoutes(config)
    };

    this.removeMatchRouteMiddleware = this.beforeEach(matchRouteMiddleware(this));
    this.removeRedirectMiddleware = this.afterEach(redirectMiddleware(this));

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
   * Registers a post middleware function
   * @param {Function} fn
   * @return {void}
   */
  afterEach(fn) {
    return this.middleware.use(fn, 'afterEach');
  }

  /**
   * Registers a pre middle function
   * @param {Function} fn
   * @return {void}
   */
  beforeEach(fn) {
    return this.middleware.use(fn, 'beforeEach');
  }

  /**
   * Runs all middleware
   * @private
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
   * Adds regex version of routes for dynamic routing
   * @private
   * @param {Object} routes
   * @return {Object}
   */
  addRegexRoutes(routes = []) {
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
   * Listens to changes on history
   * @private
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
   * public method which attempts to load the given path
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
