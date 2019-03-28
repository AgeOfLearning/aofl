/**
  * Checks to see if the given value meets the minimum length given.
  *
  * @version 1.0.0
  * @author Arian Khosravi <arian.khosravi@aofl.com>
  * @author Isaac Yoon <isaac.yoon@aofl.com>
  * @param {Number} length The min length
  * @memberof module:aofl-js/form-validate-package
  * @return {Function}
  */
const minLength = (length) => {
  return (value) => typeof value === 'string' && value.length >= length;
};

/**
  * Checks to see if the given value meets the maximum length given.
  *
  * @version 1.0.0
  * @author Arian Khosravi <arian.khosravi@aofl.com>
  * @author Isaac Yoon <isaac.yoon@aofl.com>
  * @param {Number} length The max length
  * @memberof module:aofl-js/form-validate-package
  * @return {Function}
  */
const maxLength = (length) => {
  return (value) => typeof value === 'string' && value.length <= length;
};

export {
  minLength,
  maxLength
};
