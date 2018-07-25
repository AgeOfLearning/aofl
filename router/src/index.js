import pathToRegExp from './path-to-regexp';
import {Middleware} from '@aofl/middleware';

/**
 * @class Router
 * @extends Middleware
 */
export default class Router extends Middleware {
  /**
   * @description Loads route config
   * @param {Object} config
   * @return {void}
   */
  constructor(config) {
    super('Router');
    this.middleware = {
      before: [],
      after: [],
      afterEach: [],
      beforeEach: []
    };
    this.config = {
      routes: this.addRegexRoutes(config)
    };
    this.initBeforeMiddleware();
    this.initAfterMiddleware();
    this.listen();
  }

  /**
   * @description Adds the match route before middleware logic
   * @return {void}
   */
  initBeforeMiddleware() {
    this.use(function beforeEachMatchRoute(request, response, next) {
      let match = this.matchBestPath(request.to, this.config.routes);
      if (!match) {
        if (this.defaultRoute) {
          route = this.defaultRoute;
        } else {
          throw new Error('No match found for route and no default route set.');
        }
      } else {
        let [matchedRoute, matchedProps] = match;
        let keyLen = matchedRoute.keys.length;
        let props = [];
        matchedRoute.props = {};

        if (keyLen) {
          props = matchedProps.splice(1, keyLen);
          for (let i = 0; i < keyLen; i++) {
            matchedRoute.props[matchedRoute.keys[i].name] = props[i];
          }
        }
        next(Object.assign({}, response, {matchedRoute}));
      }
    }.bind(this), 'beforeEach');
  }

  /**
   * @description Adds updateState as the first after middleware
   * @return {void}
   */
  initAfterMiddleware() {
    // add check for redirect middleware
    this.use(function afterCheckRedirect(request, response, next) {
      if (request.to !== response.to) {
        // redirect
        this.navigate(response.to, true, false, true);
      } else {
        next(response);
      }
    }.bind(this), 'after');

    this.use(function afterUpdateState(request, response, next) {
      this.updateState(response.to, request.popped);
      next(response);
    }.bind(this), 'after');
  }

  /**
   *
   * @param {Function} fn
   * @return {void}
   */
  before(fn) {
    this.use(fn, 'before');
    return this;
  }

  /**
   *
   * @param {Function} fn
   * @return {void}
   */
  after(fn) {
    this.use(fn, 'after');
    return this;
  }

  /**
   * @description Registers a post middleware function
   * @param {Function} fn
   * @return {void}
   */
  afterEach(fn) {
    this.use(fn, 'afterEach');
    return this;
  }

  /**
   * @description Registers a pre middle function
   * @param {Function} fn
   * @return {void}
   */
  beforeEach(fn) {
    this.use(fn, 'beforeEach');
    return this;
  }

  /**
   * @description Runs all middleware
   * @param {Object} request
   */
  async applyMiddlware(request) {
    let beforeEachResponse = await this.__iterateMiddleware(request, 'beforeEach', Object.assign({}, request));
    await this.__iterateMiddleware(request, 'afterEach', beforeEachResponse);
    await this.__iterateMiddleware(request, 'after', beforeEachResponse);
  }

  /**
   * @description Adds regex version of routes for dynamic routing
   * @param {Object} routes
   * @return {Object}
   */
  addRegexRoutes(routes) {
    for (let i = 0, j = routes.length; i < j; i++) {
      let keys = [];
      routes[i].path = routes[i].url;
      let regex = pathToRegExp(routes[i].path, keys);
      if (routes[i].default) {
        this.defaultRoute = routes[i];
      }

      routes[i] = Object.assign({}, routes[i], {
        keys,
        regex
      });
    }
    return routes;
  }

  /**
   * @description Listens to changes on history
   * @return {void}
   */
  listen() {
    window.addEventListener('popstate', (evt) => {
      evt.preventDefault();
      this.navigate(location.pathname, true, true);
    });
  }

  /**
   * @description Creates an array of url path segments from a url string
   * @param {String} path
   * @return {Array}
   */
  getUrlSegments(path) {
    return path.split('/').filter((val) => val);
  }

  /**
   * @description returns current url path
   * @return {String}
   */
  getCurrentPath() {
    return window.location.pathname;
  }

  /**
   * @description Evaluates whether the given segment is dynamic
   * @param {String} segment
   * @return {Boolean}
   */
  isDynamicSegment(segment) {
    return /:/.test(segment);
  }

  /**
   * @description Enumerates the number of matching segments in the given arrays of strings
   * @param {Array} segmentsA
   * @param {Array} segmentsB
   * @return {Number}
   */
  numOfMatchingSegments(segmentsA, segmentsB) {
    let matches = 0;
    for (let i = 0, j = segmentsA.length; i < j; i++) {
      if (segmentsA[i] === segmentsB[i]) matches++;
      else if (!this.isDynamicSegment(segmentsA[i] && !this.isDynamicSegment(segmentsB))) {
        // Both segments are static and do not match.
        // This immediately disqualifies this as a matching route
        matches = -1;
        break;
      }
    }
    return matches;
  }

  /**
   *
   * @param {String} str
   * @return {String}
   */
  removeTrailingSlash(str) {
    if (str[str.length-1] === '/') {
      str = str.substring(0, str.length-1);
    }
    return str;
  }

  /**
   * @description Evaluates and returns the best matching route for the given path
   * @param {String} path
   * @param {Array} routes
   * @return {Object}
   */
  matchBestPath(path, routes) {
    let stack = [];
    // remove leading '/' from path
    path = this.removeTrailingSlash(path);
    for (let i = 0, j = routes.length; i < j; i++) {
      let route = routes[i];
      route.path = this.removeTrailingSlash(route.path);
      // Exact match?
      if (path === route.path) {
        stack.shift(); // empty any existing matches
        stack.push({route, match: null});
        break;
      }
      let matchProps = routes[i].regex.exec(path);
      if (matchProps) {
        if (!stack.length) {
          stack.push({
            route,
            matchProps
          });
        } else {
          // determine the best match
          let pathSegments = this.getUrlSegments(path);
          let currentSegments = this.getUrlSegments(route.path);
          let lastSegments = this.getUrlSegments(stack[0].route.path);
          let currentSegMatches = this.numOfMatchingSegments(pathSegments, currentSegments);
          let lastSegMatches = this.numOfMatchingSegments(pathSegments, lastSegments);

          if (currentSegMatches > lastSegMatches) {
            stack.shift();
            stack.push({
              route,
              matchProps
            });
          }
        }
      }
    }
    let match = stack.shift();
    if (!match) return null;
    return [match.route, match.matchProps];
  }

  /**
   * @description public method which attempts to load the given path
   * @param {String} path
   * @param {Boolean} force
   * @param {Boolean} popped
   * @param {Boolean} isRedirect
   */
  navigate(path, force=false, popped=false, isRedirect=false) {
    let request = {
      to: path,
      from: this.getCurrentPath(),
      popped
    };

    if (path !== location.pathname || force) {
      if (isRedirect) {
        this.applyMiddlware(request, popped);
      } else {
        // Full navigation requires before middleware to be called
        this.__iterateMiddleware(request, 'before', Object.assign({}, request)).then(() => {
          this.applyMiddlware(request, popped);
        });
      }
    }
  }

  /**
   * @description Updates history state
   * @param {String} path
   * @param {Boolean} popped
   * @return {void}
   */
  updateState(path, popped = false) {
    if (!popped) {
      window.history.pushState(null, null, path);
    }
  }
}
