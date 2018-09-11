import PathUtils from '../path-utils';

/**
 * Evaluates and returns the best matching route for the given path
 *
 * @static
 * @param {String} _path
 * @param {Array} routes
 * @return {Object}
 */
const matchBestPath = (_path, routes) => {
  const path = PathUtils.removeTrailingSlash(PathUtils.cleanPath(_path));
  let stack = [];
  for (let i = 0; i < routes.length; i++) {
    let route = routes[i];
    route.path = PathUtils.removeTrailingSlash(PathUtils.cleanPath(route.path));
    console.log('route', JSON.stringify(route), route.regex);
    console.log('path', path);
    if (path === route.path) { // exact match
      stack.shift();
      stack.push(route);
      break;
    }
    let matches = route.regex.exec(path);
    console.log('matches', matches);
    if (matches !== null) {
      console.log(JSON.stringify(stack));
      if (stack.length === 0) {
        stack.push(route);
      } else {
        let pathSegments = PathUtils.getPathSegments(path);
        let routeSegments = PathUtils.getPathSegments(route.path);
        let lastSegments = PathUtils.getPathSegments(stack[0].path);
        let routeSegmentMatchesCount = PathUtils.matchingSegmentsCount(pathSegments, routeSegments);
        let lastSegmentMatchesCount = PathUtils.matchingSegmentsCount(pathSegments, lastSegments);
        if (routeSegmentMatchesCount > lastSegmentMatchesCount) {
          stack.shift();
          stack.push(route);
        }
      }
    }
  }
  let match = stack.shift();
  if (!match) return null;
  return Object.assign({}, match);
};


  /**
   * Adds the match route before middleware logic
   *
   * @static
   * @param {Object} request
   * @param {Object} response
   * @param {Function} next
   * @memberof MatchRoute
   */
export default (request, response, next) => {
  let matchedRoute = matchBestPath(request.to, request.routes);
  if (matchedRoute !== null) {
    matchedRoute.props = matchedRoute.parse(request.to);
    next(Object.assign({}, response, {matchedRoute}));
  } else {
    next(Object.assign({}, response, {matchedRoute: null}));
  }
};
