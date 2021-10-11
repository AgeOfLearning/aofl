const DYNAMIC_PATH_REGEX = /:([^/\s]*)(\/?)/ig;
const CLEAN_PATH_REGEX = /[#?].*/i;
const TRAILING_SLASH_REGEX = /\/$/i;
const LEADING_SLASH_REGEX = /^\//i;

class PathUtils {
  static getRegex(_path: string) {
    const path = PathUtils.removeTrailingSlash(PathUtils.cleanPath(_path));
    let regexStr = '';
    let matches = DYNAMIC_PATH_REGEX.exec(path);
    const keys: Array<string> = [];
    if (matches === null) {
      regexStr = path;
    } else {
      let nextMatchIndex = 0;
      while (matches) {
        regexStr += path.substring(nextMatchIndex, matches.index) + '([^\\/\\s]+)' + matches[2];
        nextMatchIndex = matches.index + matches[0].length;
        keys.push(matches[1]);
        matches = DYNAMIC_PATH_REGEX.exec(path);
      }

      regexStr += path.substr(nextMatchIndex);
    }

    const regex = new RegExp('^' + regexStr + '\\/?$');
    return {
      regex,
      parse(p: string) {
        if (keys.length === 0) return {};
        const cleanPath = PathUtils.removeTrailingSlash(PathUtils.cleanPath(p));
        const pathMatches = regex.exec(cleanPath);
        return keys.reduce((acc: any, key, index) => {
          if (pathMatches !== null) {
            acc[key] = pathMatches[index + 1];
          }
          return acc;
        }, {});
      }
    };
  }


  static cleanPath(path: string): string {
    return path.replace(CLEAN_PATH_REGEX, '');
  }

  static removeTrailingSlash(str: string): string {
    if (str === '/') return str;
    return str && str.replace(TRAILING_SLASH_REGEX, '');
  }

  static removeLeadingSlash(str: string): string {
    if (str === '/') return str;
    return str && str.replace(LEADING_SLASH_REGEX, '');
  }

  /**
   * Creates an array of url path segments from a url string
   */
  static getPathSegments(path: string): Array<string> {
    return path.split('/').filter((item) => item);
  }


  /**
   * Evaluates whether the given segment is dynamic
   */
  static isDynamicSegment(segment: string): boolean {
    return segment.indexOf(':') > -1;
  }
  /**
   * Enumerates the number of matching segments in the given arrays of strings
   */
  static matchingSegmentsCount(segmentsA: Array<string>, segmentsB: Array<string>): number {
    let matches = 0;
    for (let i = 0; i < segmentsA.length && i < segmentsB.length; i++) {
      /* istanbul ignore else */
      if (segmentsA[i] === segmentsB[i]) {
        matches++;
      } else if (!PathUtils.isDynamicSegment(segmentsA[i]) && !PathUtils.isDynamicSegment(segmentsB[i])) {
        // Both segments are static and do not match.
        // This immediately disqualifies this as a matching route
        matches = -1;
        break;
      }
    }
    return matches;
  }

  /**
  * Evaluates and returns the best matching route for the given path
  */
  static matchBestPath(_path : string, routes: Array<any>) {
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
  }
}

export {
  PathUtils,
  LEADING_SLASH_REGEX,
  TRAILING_SLASH_REGEX,
  CLEAN_PATH_REGEX,
  DYNAMIC_PATH_REGEX
};
