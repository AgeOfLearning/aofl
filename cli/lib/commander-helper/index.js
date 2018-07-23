/**
 * set of helper functions
 */
class CommanderHelper {
  /**
   * takes list values and returns an array
   * @param {String} val input from command line
   * @return {Array}
   */
  static list(val) {
    return val.split(',');
  }

  /**
   *
   * @param {String} val command line input
   * @param {Array} memo collection of values
   * @return {Array}
   */
  static collect(val, memo) {
    memo.push(val);
    return memo;
  }
}

module.exports = CommanderHelper;
