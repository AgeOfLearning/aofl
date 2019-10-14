/* eslint no-invalid-this: "off", require-jsdoc: "off" */
import {isAllDigits} from '../modules/is-all-digits';

describe('@aofl/aofl-validate/is-all-digit', function() {
  it('should be true when input is all digits', function() {
    expect(isAllDigits('1234')).to.be.true;
  });

  it('should be false when input is all digits and not a string', function() {
    expect(isAllDigits(1234)).to.be.false;
  });

  it('should be false when input contains non-digits', function() {
    expect(isAllDigits('1234.123')).to.be.false;
  });
});
