/* eslint no-invalid-this: "off" */
import {has} from '../modules/has';

describe('object-utils#has', function() {
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

  it('Should return true when shalow property exists', function() {
    expect(has(this.data, 'prop1')).to.be.true;
  });

  it('Should return false when shalow property does not exists', function() {
    expect(has(this.data, 'noprop')).to.be.false;
  });

  it('Should return true when nested property exists', function() {
    expect(has(this.data, 'prop2.prop1')).to.be.true;
  });

  it('Should return false when nested property does not exists', function() {
    expect(has(this.data, 'prop2.prop1.noprop')).to.be.false;
  });

  it('Should return false when nested property does not exists', function() {
    expect(has(this.data, 'noprop.noprop')).to.be.false;
  });
});
