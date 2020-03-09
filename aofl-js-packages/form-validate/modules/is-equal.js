/**
 * @summary is-equal
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {compare} from './compare';
/**
 * Tracks two properties of any class to be equal.
 *
 * @memberof module:@aofl/form-validate
 *
 * @param {String} propPath
 *
 * @return {Function} True or false if the given value passes the
 *                   given regex test is valid.
 */
const isEqual = (propPath) => {
  return compare(propPath, (value, otherValue) => {
    return Boolean(value && value === otherValue);
  });
};

export {
  isEqual
};
