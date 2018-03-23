/**
 * isValidFormat
 *
 * @param {String} value
 * @param {String} regex
 * @return {Boolean} True or false if the given value passes the
 *                   given regex test is valid.
 */
function isValidFormat(value, regex) {
  return regex.test(value);
}

export {
  isValidFormat
};
