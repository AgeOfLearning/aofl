/* eslint no-invalid-this: "off" */
import {deepFreeze} from '../modules/deep-freeze';
import {expect} from 'chai';

describe('object-utils#deepFreeze', function() {
  beforeEach(function() {
    this.data = deepFreeze({
      prop1: '',
      prop2: {
        prop1: ''
      }
    });
  });

  it('should throw an error when object property is reassigned', function() {
    const badFn = () => {
      this.data.prop1 = 'other';
    };

    expect(badFn).to.throw;
  });

  it('should throw an error when object\'s nested property is reassigned', function() {
    const badFn = () => {
      this.data.prop2.prop1 = 'other';
    };

    expect(badFn).to.throw;
  });
});
