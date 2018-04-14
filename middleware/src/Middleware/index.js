/**
 *
 *
 * @class Middleware
 */
class Middleware {
  /**
   * Creates an instance of Middleware.
   * @param {any} namespace
   * @memberof Middleware
   */
  constructor(namespace) {
    this.middleware = {
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
  __getMiddlewareIterator(enforce = 'post') {
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
  __iterateMiddleware(request, enforce = 'post', response = null) {
    return new Promise((resolve, reject) => {
      let iterator = this.__getMiddlewareIterator(enforce);
      let mw = null;
      let resp = response;
      let next = (response) => {
        mw = iterator.next();
        resp = response;
        if (mw.done !== true) {
          mw.value.callback(request, response, next);
        }
      };

      next(response);

      if (mw.done !== true) {
        return reject(resp);
      }
      return resolve(resp);
    });
  }
}

export default Middleware;
