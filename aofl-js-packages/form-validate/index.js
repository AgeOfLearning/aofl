/**
 * Exports the ValidationMixin and some commonly needed validations
 *
 * @module aofl-js/form-validate-package
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

import validationMixin from './modules/validation-mixin';
import isAllDigits from './modules/is-all-digits';
import isEqual from './modules/is-equal';
import {minLength, maxLength} from './modules/length';
import isRequired from './modules/is-required';

export {
  validationMixin,
  isAllDigits,
  isEqual,
  isRequired,
  minLength,
  maxLength
};
