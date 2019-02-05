import PathUtils from '../path-utils';

/**
 * Evaluates and returns the best matching route for the given path
 *
 * @summary match route middleware
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @param {String} _path
 * @param {Array} routes
 * @memberof module:aofl-js/router-package/src/match-route-middleware
 * @return {Object}
 */
const matchBestPath = (_path, routes) => {
  const path = PathUtils.removeTrailingSlash(PathUtils.cleanPath(_path));
  const stack = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    route.path = PathUtils.removeTrailingSlash(PathUtils.cleanPath(route.path));
    if (path === route.path) { // exact match
      stack.shift();
      stack.push(route);
      break;
    }
    const matches = route.regex.exec(path);
    if (matches !== null) {
      if (stack.length === 0) {
        stack.push(route);
      } else {
        const pathSegments = PathUtils.getPathSegments(path);
        const routeSegments = PathUtils.getPathSegments(route.path);
        const lastSegments = PathUtils.getPathSegments(stack[0].path);
        const routeSegmentMatchesCount = PathUtils.matchingSegmentsCount(pathSegments, routeSegments);
        const lastSegmentMatchesCount = PathUtils.matchingSegmentsCount(pathSegments, lastSegments);
        if (routeSegmentMatchesCount > lastSegmentMatchesCount) {
          stack.shift();
          stack.push(route);
        }
      }
    }
  }
  const match = stack.shift();
  if (!match) { return null; }
  return Object.assign({}, match);
};


/**
 * Adds the match route before middleware logic
 *
 * @summary match route middleware
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 *
 * @param {Object} router
 * @return {Function}
 */
export default (router) => (request, response, next) => {
  const matchedRoute = matchBestPath(request.to, request.routes);
  let currentRoute = null;
  if (matchedRoute !== null) {
    matchedRoute.props = matchedRoute.parse(request.to);
    currentRoute = Object.assign({}, response, {matchedRoute});
  } else {
    currentRoute = Object.assign({}, response, {matchedRoute: null});
  }
  router.currentRoute = currentRoute; // add MatchedRoute to the router instance
  next(currentRoute);
};
