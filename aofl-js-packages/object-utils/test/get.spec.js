/* eslint no-invalid-this: "off" */
import {get} from '../modules/get';
import {expect} from 'chai';

describe('object-utils#get', function() {
  beforeEach(function() {
    this.data = {
      prop1: '',
      prop2: {
        prop1: true
      },
      prop3: {
        prop1: {
          prop1: {
            prop1: {

            }
          },
          prop2: {

          }
        }
      }
    };
  });

  it('Should return shalow property', function() {
    expect(get(this.data, 'prop1')).to.equal(this.data.prop1);
  });

  it('Should return nested property', function() {
    expect(get(this.data, 'prop2.prop1')).to.equal(this.data.prop2.prop1);
  });

  it('Should return undefined when nested prop is undefined', function() {
    expect(get(this.data, 'noprop.noprop')).to.equal(void 0);
  });
});
