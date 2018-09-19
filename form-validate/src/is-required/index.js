/**
 * isRequired
 *
 * @param {String} value
 * @return {Boolean}
 */
function isRequired(value) {
  return typeof value === 'string' && value !== '';
}

export default isRequired;
