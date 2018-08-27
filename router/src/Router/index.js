import PathUtils from '../path-utils';
import {Middleware} from '@aofl/middleware';
import matchRouteMiddleware from '../match-route-middleware';
import redirectMiddleware from '../redirect-middleware';
import updateStateMiddleware from '../update-state-middleware';

/**
 * @class Router
 * @extends Middleware
 */
class Router {
  /**
   * @description Loads route config
   * @return {void}
   */
  constructor() {
    this.middleware = new Middleware('before', 'after', 'afterEach', 'beforeEach');
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
    this
      .beforeEach(matchRouteMiddleware)
      .after(redirectMiddleware(this))
      .after(updateStateMiddleware);
    this.removeListener = this.listen();
  }

  /**
   *
   * @param {Function} fn
   * @return {void}
   */
  before(fn) {
    this.middleware.use(fn, 'before');
    return this;
  }

  /**
   *
   * @param {Function} fn
   * @return {void}
   */
  after(fn) {
    this.middleware.use(fn, 'after');
    return this;
  }

  /**
   * @description Registers a post middleware function
   * @param {Function} fn
   * @return {void}
   */
  afterEach(fn) {
    this.middleware.use(fn, 'afterEach');
    return this;
  }

  /**
   * @description Registers a pre middle function
   * @param {Function} fn
   * @return {void}
   */
  beforeEach(fn) {
    this.middleware.use(fn, 'beforeEach');
    return this;
  }

  /**
   * @description Runs all middleware
   * @param {Object} request
   */
  async applyMiddlware(request) {
    let beforeEachResponse = await this.middleware.iterateMiddleware(request, 'beforeEach', Object.assign({}, request));
    await this.middleware.iterateMiddleware(request, 'afterEach', beforeEachResponse);
    let afterResponse = await this.middleware.iterateMiddleware(request, 'after', beforeEachResponse);
    if (afterResponse.redirect) return afterResponse.redirect;
    return true;
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
    let popStateHandler = (e) => {
      e.preventDefault();
      this.navigate(location.pathname, true, true);
    };
    window.addEventListener('popstate', popStateHandler);
    return () => {
      window.removeEventListener('popstate', popStateHandler);
    };
  }

  /**
   * @description public method which attempts to load the given path
   * @param {String} path
   * @param {Boolean} force
   * @param {Boolean} popped
   * @param {Boolean} isRedirect
   */
  async navigate(path, force=false, popped=false, isRedirect=false) {
    let request = {
      to: path,
      from: location.pathname,
      routes: this.config.routes,
      popped
    };
    if (path !== location.pathname || force) {
      if (!isRedirect) {
        await this.middleware.iterateMiddleware(request, 'before', Object.assign({}, request));
      }
      return await this.applyMiddlware(request, popped);
    } else {
      return Promise.reject('Can\'t navigate to current path');
    }
  }
}

export default Router;
