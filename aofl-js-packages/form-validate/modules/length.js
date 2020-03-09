/**
  * @summary length
  * @version 3.0.0
  * @since 1.0.0
  * @author Arian Khosravi <arian.khosravi@aofl.com>
  * @author Isaac Yoon <isaac.yoon@aofl.com>
  */

/**
  * Checks to see if the given value meets the minimum length given.
  *
  * @memberof module:@aofl/form-validate
  *
  * @param {Number} length The min length
  * @return {Function}
  */
const minLength = (length) => {
  return (value) => {
    if (!value) return false;
    if (typeof value.length === 'undefined') {
      value = String(value);
    }
    return Boolean(value.length >= length);
  };
};

/**
  * Checks to see if the given value meets the maximum length given.
  *
  * @memberof module:@aofl/form-validate

  * @param {Number} length The max length
  * @return {Function}
  */
const maxLength = (length) => {
  return (value) => {
    if (!value) return false;
    if (typeof value.length === 'undefined') {
      value = String(value);
    }
    return Boolean(value.length <= length);
  };
};

export {
  minLength,
  maxLength
};
