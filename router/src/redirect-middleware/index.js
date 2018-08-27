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
      next(Object.assign({}, response, {redirect: router.navigate(response.to, true, false, true)}));
    } else {
      next(response);
    }
  };
};
