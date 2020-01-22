const {spawn} = require('cross-spawn');
const path = require('path');

/**
 *
 *
 * @class TerminalHelper
 */
class TerminalHelper {
  /**
   *
   *
   * @static
   * @param {String} from
   * @param {String} to
   * @param {Object} options
   * @return {Promise}
   * @memberof TerminalHelper
   */
  static cp(from, to, options = {}) {
    return new Promise((resolve, reject) => {
      const cp = spawn('cp', [
        path.resolve(from),
        path.resolve(to)
      ], Object.assign({stdio: 'inherit'}, options));

      cp.on('close', (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}

module.exports.TerminalHelper = TerminalHelper;
