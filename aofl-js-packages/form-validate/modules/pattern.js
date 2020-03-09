/**
 * @summary pattern
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
/**
 * Tests if input matches the given pattern.
 *
 * @memberof module:@aofl/form-validate
 *
 * @param {String|RegExp} regex
 * @param {String} flags
 *
 * @return {Function} True or false if the given value passes the
 *                   given regex test is valid.
 */
const pattern = (regex, flags) => {
  if (!(regex instanceof RegExp)) {
    regex = new RegExp(regex, flags);
  }
  return /** @this HTMLElement */ function patternsMathValidator(value) {
    return regex.test(String(value));
  };
};

export {
  pattern
};
