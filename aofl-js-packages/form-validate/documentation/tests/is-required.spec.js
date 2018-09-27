/* eslint no-invalid-this: "off", require-jsdoc: "off" */
import {isRequired} from '../../';

describe('@aofl/aofl-validate/is-required', function() {
  it('should be true when a string of length > 0 is passed', function() {
    expect(isRequired('hello')).to.be.true;
  });

  it('should be false when a undefined is passed', function() {
    expect(isRequired(void 0)).to.be.false;
  });

  it('should be false when a null is passed', function() {
    expect(isRequired(null)).to.be.false;
  });

  it('should be false when a string of length = 0 is passed', function() {
    expect(isRequired('')).to.be.false;
  });

  it('should be false when a object is passed', function() {
    expect(isRequired({})).to.be.false;
  });
  it('should be false when a object is passed', function() {
    expect(isRequired({})).to.be.false;
  });
});
