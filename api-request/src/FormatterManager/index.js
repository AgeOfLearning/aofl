/**
 * formatter manager hold reference to available formatter layouts
 *
 * @summary FormatterManager
 * @version 1.0.0-beta.1
 * @author Isaac Yoon <isaac.yoon@aofl.com>
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 *
 */
class FormatterManager {
  /**
   * constructor
   */
  constructor() {
    this.formatters = {};
  }

  /**
   * used to retrieve formatter based on format name
   *
   * @param {String} format name of the format
   * @return {Object}
   */
  getFormmatter(format) {
    return this.formatters[format];
  }

  /**
   * adds formatter to the formatters object
   *
   * @param {String} format name of the format
   * @param {Object} formatter formatter object
   */
  addFormatter(format, formatter) {
    this.formatters[format] = formatter;
  }
}

export default FormatterManager;
