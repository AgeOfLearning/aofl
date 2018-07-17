/**
  * Checks to see if the given value meets the minimum length given.
  *
  * @param {Number} length The min length
  * @return {Function}
  */
const minLength = (length) => {
  return (value) => value.length >= length;
};

/**
  * Checks to see if the given value meets the maximum length given.
  *
  * @param {Number} length The max length
  * @return {Function}
  */
const maxLength = (length) => {
  return (value) => value.length <= length;
};

export {
  minLength,
  maxLength
};
