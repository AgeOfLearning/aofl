/**
 *
 *
 * @class Middleware
 */
class Middleware {
  /**
   * Creates an instance of Middleware.
   * @param {Object} middleware
   * @memberof Middleware
   */
  constructor(middleware) {
    this.middleware = middleware || {
      pre: [],
      post: []
    };
  }

  /**
   *
   * @param {Function} callback
   * @param {string} [enforce='post|pre']
   * @memberof Middleware
   */
  use(callback, enforce = 'post') {
    if (typeof callback !== 'function') new Error('callback must be a function');
    if (typeof this.middleware[enforce] === 'undefined') new Error(`Only \'post\' or \'pre\' are supported. ${enforce} enforce type not supported.`);
    this.middleware[enforce].push({
      callback,
      enforce
    });
  }

  /**
   *
   * @param {string} [enforce='post']
   * @return {Iterator}
   * @memberof Middleware
   */
  getMiddlewareIterator(enforce = 'post') {
    let collection = this.middleware[enforce];
    let nextIndex = 0;

    return {
      next() {
        return nextIndex < collection.length ?
        {value: collection[nextIndex++], done: false} :
        {done: true};
      }
    };
  }

  /**
   * @param {*} request
   * @param {string} [enforce='post']
   * @param {*} response
   * @return {Promise}
   * @memberof Middleware
   */
  iterateMiddleware(request, enforce = 'post', response = null) {
    return new Promise((resolve, reject) => {
      let iterator = this.getMiddlewareIterator(enforce);
      let mw = null;
      let next = (response = null) => {
        mw = iterator.next();
        if (mw.done !== true) {
          mw.value.callback(request, response, next);
        } else {
          resolve(response);
        }
      };
      next(response);
    });
  }
}

export default Middleware;
