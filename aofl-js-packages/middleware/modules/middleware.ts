/**
 * @summary middleware
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */


type MiddlewareFunction = (request: any, response: any, next: any, interrupt?: any) => void;
type InterruptFunction = (request: any, response: any) => boolean;

type UnsubscribeFunction = {
  executed: boolean;
  (): void
};

interface Hook {
  callback: MiddlewareFunction,
  hook: string
};

interface Hooks {
  [key: string]: Array<Hook>
}

class Middleware {
  /**
   * Creates an instance of Middleware.
   *
   * @param hooks name of the hooks for this middleware instance
   */
  constructor(...hooks: string[]) {
    for (let i = 0; i < hooks.length; i++) {
      this.middleware[hooks[i]] = [];
    }
  }

  private middleware: Hooks = {};

  /**
   * Add a middleware function to specified hook.
   *
   * @param hook
   * @param callback
   */
  use(hook: string, callback: MiddlewareFunction) {
    if (typeof this.middleware[hook] === 'undefined') {
      throw new Error(`Only ${Object.keys(this.middleware)} hooks are supported.`);
    }

    this.middleware[hook].push({
      callback,
      hook
    });

    return this.createUnsubscribeFn(hook, callback);
  }

  /**
   * Get middleware hooks by hook name.
   *
   * @param hook
   */
  getHookIterator(hook: string) : IterableIterator<Hook>{
    return this.middleware[hook][Symbol.iterator]();
  }

  /**
   * Call all middleware functions by hook name. The interrupt function is called between each
   * middleware function and acts as circuit breaker.
   *
   * @param hook
   * @param request
   * @param response
   * @param interrupt
   */
  iterateMiddleware( hook: string, request: any, response : any = null, interrupt : InterruptFunction) {
    return new Promise((resolve, reject) => {
      const iterator = this.getHookIterator(hook);
      const next = (/* istanbul ignore next */argResponse = null, err = null) => {
        if (err !== null) {
          reject(err);
        }
        const mw = iterator.next();
        let proceed = true;
        if (typeof interrupt === 'function') {
          proceed = interrupt(request, argResponse);
        }
        if (proceed) {
          if (mw.done !== true) {
            mw.value.callback(request, argResponse, next);
          } else {
            resolve(argResponse);
          }
        }
      };
      next(response);
    });
  }


  /**
   * Creates an unsubscribe function
   *
   * @param hook
   * @param callback
   */
  private createUnsubscribeFn(hook: string, callback: MiddlewareFunction) {
    const unsubscribe : UnsubscribeFunction = () => {
      if (unsubscribe.executed) { return; }
      unsubscribe.executed = true;

      for (let i = 0; i < this.middleware[hook].length; i++) {
        if (callback === this.middleware[hook][i].callback) {
          this.middleware[hook].splice(i, 1);
          break;
        }
      }
    };
    unsubscribe.executed = false;

    return unsubscribe;
  }
}

export {
  Middleware,
  Hook,
  Hooks,
  InterruptFunction,
  MiddlewareFunction,
  UnsubscribeFunction
};
