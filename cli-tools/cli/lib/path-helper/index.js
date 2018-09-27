const path = require('path');
const fs = require('fs');

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
          let stat = fs.statSync(_path);
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
}

module.exports = PathHelper;
