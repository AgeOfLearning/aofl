/**
 * tracks two properties of any class to be equal
 *
 * @summary isEqual validator
 * @version 1.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @author Isaac Yoon <isaac.yoon@aofl.com>
 * @module @aofl/aofl-validate/isEqual
 */

/**
 * isEqual
 *
 * @param {String} propName
 * @return {Function} True or false if the given value passes the
 *                   given regex test is valid.
 */
let isEqual = (propName) => {
  let touchBound = null;
  let tempTouch = null;
  let touch = function touch(prop, ...args) {
    if (this[prop]) { // eslint-disable-line
      this.$v[prop].$touch(); // eslint-disable-line
    }
    return tempTouch(...args);
  };

  return function isEqualValidator(value, prop) {
    if (typeof this[propName] === 'undefined') return false; // eslint-disable-line
    if (touchBound === null) {
      tempTouch = this.$v[propName].$touch; // eslint-disable-line
      touchBound = touch.bind(this, prop); // eslint-disable-line
      this.$v[propName].$touch = touchBound; // eslint-disable-line
    }
    return this[propName] === value; // eslint-disable-line
  };
};

export default isEqual;
