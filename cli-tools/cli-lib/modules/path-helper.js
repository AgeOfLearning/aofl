const path = require('path');
const fs = require('fs');

const TRAILING_SLASH_REGEX = new RegExp(`\\${path.sep}$`, 'i');
const LEADING_SLASH_REGEX = new RegExp(`^\\${path.sep}`, 'i');
const CLEAN_PATH_REGEX = /[#?].*/i;

/**
 * shared methods for path operations
 */
class PathHelper {
  /**
   * @param {Array} _paths list of paths
   * @return {Array}
   */
  static resolvePaths(_paths) {
    return _paths
      .map((_path) => path.resolve(_path));
  }

  /**
   * @param {Array} _paths list of paths
   * @return {Array} array of resolved dirnames
   */
  static resolvePathDir(_paths) {
    return PathHelper
      .resolvePaths(_paths)
      .map((_path) => {
        try {
          const stat = fs.statSync(_path);
          if (stat.isDirectory()) {
            return _path;
          }
        } catch (e) {
          return path.dirname(_path);
        }
        return path.dirname(_path);
      });
  }


  /**
   *
   *
   * @static
   * @param {*} _paths
   * @param {string} [_matchPattern='*']
   * @return {Array}
   * @memberof PathHelper
   */
  static convertToGlobPattern(_paths, _matchPattern = '*') {
    return PathHelper
      .resolvePathDir(_paths)
      .map((_path) => path.join(_path, '**', _matchPattern));
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
    return str && str.replace(TRAILING_SLASH_REGEX, '');
  }

  /**
   * @param {String} str
   * @return {String}
   */
  static removeLeadingSlash(str) {
    return str && str.replace(LEADING_SLASH_REGEX, '');
  }

  static stripEndSlashes(str) {
    str = PathHelper.removeLeadingSlash(str);
    str = PathHelper.removeTrailingSlash(str);
    return str;
  }
}

module.exports.PathHelper = PathHelper;
