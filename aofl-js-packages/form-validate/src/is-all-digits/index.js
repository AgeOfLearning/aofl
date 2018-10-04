
const allDigitRegex = /^[0-9]+$/;

/**
 * Checks to see if a given value is all digits or not.
 *
 * @summary is-all-digits
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @author Isaac Yoon <isaac.yoon@aofl.com>
 * @param {Mixed} value The value being validated
 * @memberof module:aofl-js/form-validate-package
 * @return {Boolean} True or false if the regex passes
 */
function isAllDigits(value) {
  return typeof value === 'string' && allDigitRegex.test(value);
}

export default isAllDigits;
