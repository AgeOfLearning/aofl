const allDigitRegex = /^[0-9]+$/;
/**
 * Checks to see if a given value is all digits or not.
 *
 * @param {Mixed} value The value being validated
 * @return {Boolean} True or false if the regex passes
 */
function isAllDigits(value) {
  return !allDigitRegex.test(value);
}

export default isAllDigits;
