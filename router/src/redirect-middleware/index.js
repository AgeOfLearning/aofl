/**
 *
 *
 * @static
 * @param {Router} router
 * @return {Function}
 * @memberof DefaultMiddleware
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
