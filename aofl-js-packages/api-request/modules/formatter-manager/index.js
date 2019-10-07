/**
 * formatter manager hold reference to available formatter layouts
 *
 * @summary FormatterManager
 * @version 1.0.0
 * @author Isaac Yoon <isaac.yoon@aofl.com>
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 *
 */

/**
 * @example
 * class SampleFormatter {
 *   static pack(payload) {
 *     const boundary = 'Boundary-' + Date.now();
 *     const args = JSON.stringify(payload.args);
 *
 *     const body = new FormData();
 *     body.append('arguments', args);
 *
 *     return {
 *       method: 'POST',
 *       body,
 *       mode: 'cors',
 *       credentails: 'include'
 *     };
 *   }
 *
 *   static unpack(response) {
 *     return response.json();
 *   }
 * }
 *
 * export default SampleFormatter;
 */
class FormatterManager {
  /**
   * constructor
   */
  constructor() {
    this.formatters = {};
  }

  /**
   * Get formatter based on format name
   *
   * @param {String} format name of the format
   * @return {Object}
   */
  getFormatter(format) {
    if (Object.hasOwnProperty.call(this.formatters, format)) {
      return this.formatters[format];
    }
  }

  /**
   * Add formatter to the formatters object
   *
   * @param {String} format name of the format
   * @param {Object} formatter formatter object
   * @throws {TypeError} Will throw an error when the provided pormatter doesn't implement pack() and unpack()
   * @throws {Error} Will throw an error when attempting to replace an existing formatter
   */
  addFormatter(format, formatter) {
    if (typeof formatter.pack !== 'function' || typeof formatter.unpack !== 'function') {
      throw new TypeError('formatter must implement pack() and unpack() functions');
    }

    if (typeof this.formatters[format] !== 'undefined') {
      throw new Error(`${format} already exists. Cannot replace an existing format.`);
    }

    this.formatters[format] = formatter;
  }
}

export default FormatterManager;
