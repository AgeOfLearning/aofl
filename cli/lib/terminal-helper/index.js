const {spawn} = require('child_process');
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
      let cp = spawn('cp', [
        path.resolve(from),
        path.resolve(to)
      ], Object.assign({stdio: 'inherit'}, options));

      cp.on('close', (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }
}

module.exports = TerminalHelper;
