type NextFunction = (data?: unknown, err?: Error|null) => void;
type MiddlewareFunction = (request: any, response: any, next: NextFunction) => void;
type InterruptFunction = (request: any, response: any) => boolean;

type UnsubscribeFunction = {
  /** @internal */
  executed: boolean;
  (): void
};

class Middleware {
  private middleware: Array<MiddlewareFunction> = [];

  /**
   * Add a middleware function to specified hook.
   *
   * @param callback
   */
  use(callback: MiddlewareFunction) : UnsubscribeFunction {
    this.middleware.push(callback);

    return this.createUnsubscribeFn(callback);
  }

  *[Symbol.iterator]() : Generator<any, any, any> {
    yield* this.middleware;
  }
  /**
   * Call all middleware functions by hook name. The interrupt function is called between each
   * middleware function and acts as circuit breaker.
   *
   * @param request
   * @param response
   * @param interrupt
   */
  iterateMiddleware(request: any, response : any = null, interrupt? : InterruptFunction) : Promise<any> {
    return new Promise((resolve, reject) => {
      const iterator = this[Symbol.iterator]();
      const next : NextFunction = (/* istanbul ignore next */argResponse = null, err = null) => {
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
            (mw.value as MiddlewareFunction)(request, argResponse, next);
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
   * @param callback
   */
  private createUnsubscribeFn(callback: MiddlewareFunction) {
    const unsubscribe : UnsubscribeFunction = () => {
      if (unsubscribe.executed) { return; }
      unsubscribe.executed = true;

      for (let i = 0; i < this.middleware.length; i++) {
        if (callback === this.middleware[i]) {
          this.middleware.splice(i, 1);
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
  NextFunction,
  InterruptFunction,
  MiddlewareFunction,
  UnsubscribeFunction
};
