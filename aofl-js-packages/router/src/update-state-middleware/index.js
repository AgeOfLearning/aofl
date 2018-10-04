/**
 * @summary update state middleware
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 */
export default (request, response, next) => {
  if (!request.popped && response.matchedRoute !== null) {
    window.history.pushState(null, null, response.to);
  }
  next(response);
};
