/**
 * @summary is-equal
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @author Isaac Yoon <isaac.yoon@aofl.com>
 */
/* eslint no-invalid-this: "off" */

/**
 * Tracks two properties of any class to be equal.
 *
 * @memberof module:@aofl/form-validate
 *
 * @param {String} propName
 *
 * @return {Function} True or false if the given value passes the
 *                   given regex test is valid.
 */
const isEqual = (propName) => {
  return function isEqualValidator(value) {
    if (typeof this.target[propName] === 'undefined') { return false; }
    return this.target[propName] === value;
  };
};

export default isEqual;
