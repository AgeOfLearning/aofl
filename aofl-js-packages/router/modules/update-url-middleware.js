/**
 * @summary update-url-middleware
 * @version 3.3.0
 * @since 3.3.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

/**
 * Updates the url of the page based on matched route.
 *
 * @memberof module:@aofl/router
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Functien} next
 */
const updateUrlMiddleware = (request, response, next) => {
  if (!request.meta.poppedState) {
    if (request.meta.replaceState) {
      window.history.replaceState(null, null, response.to);
    } else {
      window.history.pushState(null, null, response.to);
    }
  }
  next(response);
};

export {updateUrlMiddleware};
