/**
 * @summary path-utilities
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

/**
 * @memberof module:@aofl/router
 * @private
 * @type {RegExp}
 */
const DYNAMIC_PATH_REGEX = /:([^/\s]*)(\/?)/ig;
/**
 * @memberof module:@aofl/router
 * @private
 * @type {RegExp}
 */
const CLEAN_PATH_REGEX = /[#?].*/i;
/**
 * @memberof module:@aofl/router
 * @private
 * @type {RegExp}
 */
const TRAILING_SLASH_REGEX = /\/$/i;
/**
 * @memberof module:@aofl/router
 * @private
 * @type {RegExp}
 */
const LEADING_SLASH_REGEX = /^\//i;
/**
 * PathUtils implementation
 * @memberof module:@aofl/router
 */
class PathUtils {
  /**
   * @param {String} _path
   * @return {Object}
   */
  static getRegex(_path) {
    const path = PathUtils.removeTrailingSlash(PathUtils.cleanPath(_path));
    let regexStr = '';
    let matches = DYNAMIC_PATH_REGEX.exec(path);
    const keys = [];
    if (matches === null) {
      regexStr = path;
    } else {
      let nextMatchIndex = 0;
      while (matches) {
        regexStr += path.substring(nextMatchIndex, matches.index) + '([^\\/\\s]*)' + matches[2];
        nextMatchIndex = matches.index + matches[0].length;
        keys.push(matches[1]);
        matches = DYNAMIC_PATH_REGEX.exec(path);
      }

      regexStr += path.substr(nextMatchIndex);
    }

    const regex = new RegExp('^' + regexStr + '$');
    return {
      regex,
      parse(p) {
        if (keys.length === 0) return {};
        const cleanPath = PathUtils.removeTrailingSlash(PathUtils.cleanPath(p));
        const pathMatches = regex.exec(cleanPath);
        return keys.reduce((acc, key, index) => {
          acc[key] = pathMatches[index + 1];
          return acc;
        }, {});
      }
    };
  }


  /**
   * @param {*} path
   * @return {String}
   * @throws {Error}
   */
  static cleanPath(path) {
    return path.replace(CLEAN_PATH_REGEX, '');
  }


  /**
   * @param {String} str
   * @return {String}
   */
  static removeTrailingSlash(str) {
    if (str === '/') return str;
    return str && str.replace(TRAILING_SLASH_REGEX, '');
  }

  /**
   * @param {String} str
   * @return {String}
   */
  static removeLeadingSlash(str) {
    if (str === '/') return str;
    return str && str.replace(LEADING_SLASH_REGEX, '');
  }


  /**
   * Creates an array of url path segments from a url string
   *
   * @param {String} path
   * @return {Array}
   */
  static getPathSegments(path) {
    return path.split('/').filter((item) => item);
  }


  /**
   * Evaluates whether the given segment is dynamic
   *
   * @param {String} segment
   * @return {Boolean}
   */
  static isDynamicSegment(segment) {
    return segment.indexOf(':') > -1;
  }


  /**
   * Enumerates the number of matching segments in the given arrays of strings
   * @param {Array} segmentsA
   * @param {Array} segmentsB
   * @return {Number}
   */
  static matchingSegmentsCount(segmentsA, segmentsB) {
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
}

export default PathUtils;
