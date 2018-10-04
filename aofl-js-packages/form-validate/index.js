/**
 * Exports the ValidationMixin and some commonly needed validations
 *
 * @module aofl-js/form-validate-package
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

import validationMixin from './src/validation-mixin';
import isAllDigits from './src/is-all-digits';
import isEqual from './src/is-equal';
import {minLength, maxLength} from './src/length';
import isRequired from './src/is-required';

export {
  validationMixin,
  isAllDigits,
  isEqual,
  isRequired,
  minLength,
  maxLength
};
