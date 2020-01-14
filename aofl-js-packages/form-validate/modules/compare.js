/**
 * @summary compare
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @author Isaac Yoon <isaac.yoon@aofl.com>
 */
import {get} from '@aofl/object-utils';
/**
 * Tracks two properties of any class to be equal.
 *
 * @memberof module:@aofl/form-validate
 *
 * @param {String} propPath
 * @param {Function} comparator
 *
 * @return {Function} True or false if the given value passes the
 *                   given regex test is valid.
 */
const compare = /** @this HTMLElement */function(propPath, comparator) {
  return (value, target) => {
    const otherVal = get(target, propPath);
    if (typeof otherVal === 'undefined') { return false; }
    return comparator(value, otherVal);
  };
};

export {
  compare
};
