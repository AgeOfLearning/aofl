/**
 * @summary redirect middleware
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

/**
 * Detect if a redirect has occured and rests the middleware to the beginning
 * of beforeEach.
 *
 * @memberof module:@aofl/router
 *
 * @param {Router} router
 * @return {Function}
 */
const redirectMiddleware = (router) => {
  return (request, response, next) => {
    if (request.to !== response.to) {
      router.applyMiddleware(response);
    } else {
      next(response);
    }
  };
};

export {redirectMiddleware};
