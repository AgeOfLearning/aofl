/**
 * @summary redirect middleware
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @param {Router} router
 * @return {Function}
 */
export default (router) => {
  return (request, response, next) => {
    if (request.to !== response.to) {
      router.applyMiddleware(response, 'beforeEach', Object.assign({}, request));
    } else {
      next(response);
    }
  };
};
