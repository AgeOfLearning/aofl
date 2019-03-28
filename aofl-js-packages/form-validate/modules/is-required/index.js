/**
 * isRequired
 *
 * @summary is-required
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @author Isaac Yoon <isaac.yoon@aofl.com>
 * @param {String} value
 * @memberof module:aofl-js/form-validate-package
 * @return {Boolean}
 */
function isRequired(value) {
  return typeof value === 'string' && value !== '';
}

export default isRequired;
