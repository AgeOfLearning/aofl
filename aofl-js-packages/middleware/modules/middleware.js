/**
 * @summary middleware
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */


/**
 * @memberof module:@aofl/middleware
 */
class Middleware {
  /**
   * Creates an instance of Middleware.
   *
   * @param {Object} middleware
   */
  constructor(...hooks) {
    this.middleware = {};
    for (let i = 0; i < hooks.length; i++) {
      this.middleware[hooks[i]] = [];
    }
  }

  /**
   * @param {Function} callback
   * @param {String} hook
   */
  use(callback, hook) {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function');
    }
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
   * @param {String} hook
   * @return {Iterator}
   */
  getMiddlewareIterator(hook) {
    const collection = this.middleware[hook];
    let nextIndex = 0;

    return {
      next() {
        if (nextIndex < collection.length) {
          return {
            value: collection[nextIndex++],
            done: false
          };
        }

        return {
          done: true
        };
      }
    };
  }

  /**
   * @param {*} request
   * @param {String} hook
   * @param {*} response
   * @param {Function} fn
   * @return {Promise}
   */
  iterateMiddleware(request, hook, response = null, fn = null) {
    return new Promise((resolve, reject) => {
      let iterator = this.getMiddlewareIterator(hook);
      let mw = null;
      const next = (/* istanbul ignore next */argResponse = null, err = null) => {
        if (err !== null) {
          iterator = null;
          return reject(err);
        }
        mw = iterator.next();
        let proceed = true;
        if (typeof fn === 'function') {
          proceed = fn(request, argResponse);
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
   * @private
   * @param {String} hook
   * @param {function} callback
   */
  createUnsubscribeFn(hook, callback) {
    const unsubscribe = () => {
      if (unsubscribe.executed) { return; }
      Object.defineProperty(unsubscribe, 'executed', {
        value: true
      });

      for (let i = 0; i < this.middleware[hook].length; i++) {
        if (callback === this.middleware[hook][i].callback) {
          this.middleware[hook].splice(i, 1);
          break;
        }
      }
    };

    return unsubscribe;
  }
}

export {
  Middleware
};
