import {PathUtils} from './path-utils.js';
import {Middleware, MiddlewareFunction, UnsubscribeFunction} from '@aofl/middleware';
import {updateUrlMiddleware} from './update-url-middleware.js';

type Meta = {
  [key: string]: any;
}

type RouteMiddleware = {
  before?: MiddlewareFunction,
  beforeEach?: MiddlewareFunction,
  after?: MiddlewareFunction,
}

type Route = {
  path: string;
  title: string,
  meta?: Meta,
  locale?: string,
  tagName: string,
  middleware?: RouteMiddleware,
  props?: any,
  options?: any,
  resolve: () => any,
  regex?: RegExp,
  parse?: any,
  rotation?: string
}

type Request = {
  to: string,
  from?: string,
  options?: NavigateOptions
}

type Config = {
  routes: Array<Route>
}

type NavigateOptions = {
  poppedState?: boolean,
  replaceState?: boolean
}

/**
 * A client side router that uses history api and implements a middleware. This router
 * implementation is minimal yet very powerful. It will match routes and handles
 * redirects out of the box. Everything else can be programmed using an appropriate
 * middleware function.
 *
 */
class Router {
  removeUpdateUrl : UnsubscribeFunction;
  removeListener = () => {};
  publicPath = '/';

  private beforeMiddleware = new Middleware();
  private afterMiddleware = new Middleware();
  private beforeEachMiddleware = new Middleware();
  private _route : Route|null = null;
  private _request : Request|null = null;
  private config : Config = {
    routes: []
  };

  constructor(publicPath: string = '/') {
    this.removeUpdateUrl = this.after(updateUrlMiddleware);
    this.removeListener = this.listen();
    this.publicPath = publicPath;
  }
  /**
   * Loads rotes config
   */
  init(config: Array<any>, publicPath: string) {
    if (typeof publicPath !== 'undefined') {
      this.publicPath = publicPath;
    }
    this.config = {
      routes: this.addRegexRoutes(config)
    };
  }

  seal() {
    for (let i = 0; i < this.config.routes.length; i++) {
      const conf = this.config.routes[i];

      if (typeof conf.middleware?.before !== 'undefined') {
        const mw = conf.middleware.before;
        conf.middleware.before = this.before((req, resp, next) => {
          if (resp.matchedRoute !== null && conf.regex && conf.regex.test(resp.to)) {
            mw(req, resp, next);
          } else {
            next(resp);
          }
        });
      }

      if (typeof conf.middleware?.beforeEach !== 'undefined') {
        const mw = conf.middleware.beforeEach;
        conf.middleware.beforeEach = this.beforeEach((req, resp, next) => {
          if (resp.matchedRoute !== null && conf.regex && conf.regex.test(resp.to)) {
            mw(req, resp, next);
          } else {
            next(resp);
          }
        });
      }

      if (typeof conf.middleware?.after !== 'undefined') {
        const mw = conf.middleware.after;
        conf.middleware.after = this.after((req, resp, next) => {
          if (resp.matchedRoute !== null && conf.regex && conf.regex.test(resp.to)) {
            mw(req, resp, next);
          } else {
            next(resp);
          }
        });
      }
    }
  }

  get route() {
    return this._route;
  }

  get request() {
    return this._request;
  }

  before(fn: MiddlewareFunction) {
    return this.beforeMiddleware.use(fn);
  }

  beforeEach(fn: MiddlewareFunction) {
    return this.beforeEachMiddleware.use(fn);
  }
  after(fn: MiddlewareFunction) {
    return this.afterMiddleware.use(fn);
  }


  async applyMiddleware(request: any) {
    try {
      const matchedRoute = PathUtils.matchBestPath(request.to, this.config.routes);
      if (matchedRoute !== null) {
        matchedRoute.props = matchedRoute.parse(request.to);
      }
      this._route = matchedRoute;

      const beforeEachResponse = await this.beforeEachMiddleware
        .iterateMiddleware(request, Object.assign({}, request), (req, resp) => {
          if (req.to !== resp.to) {
            this.applyMiddleware(resp);
            return false;
          }
          return true;
        });

      await this.afterMiddleware.iterateMiddleware(request, Object.assign({}, beforeEachResponse));
    } catch (e) {
      return Promise.reject(e);
    }
  }


  /**
   * Adds regex version of routes for dynamic routing
   */
  private addRegexRoutes(routes: Array<any> = []) {
    for (let i = 0; i < routes.length; i++) {
      const path = (this.publicPath + routes[i].path).replace(/\/\//g, '/');
      const {regex, parse} = PathUtils.getRegex(path);
      routes[i] = Object.assign({}, routes[i], {
        path,
        regex,
        parse
      });
    }
    return routes;
  }

  /**
   * Listens to changes on history
   */
  listen() {
    const popStateHandler = (e: Event) => {
      e.preventDefault();
      this.navigate(location.href.replace(location.origin, '').replace('index.html', ''), {
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
   */
  async navigate(path: string, options: NavigateOptions = {poppedState: false, replaceState: false}) {
    const _options = Object.assign({poppedState: false, replaceState: false}, options);

    if (path.indexOf(this.publicPath) !== 0) {
      path = (this.publicPath + path).replace(/\/\//g, '/');
    }

    const request = {
      to: path,
      from: this._request ? this._request.to : document.referrer,
      options: _options
    };
    this._request = request;

    await this.beforeMiddleware.iterateMiddleware(request, Object.assign({}, request));
    return this.applyMiddleware(request);
  }
}

export {
  Router,
  Config,
  Meta,
  NavigateOptions,
  Request,
  Route,
  RouteMiddleware
};
