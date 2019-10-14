/* eslint no-invalid-this: "off" */
import {set} from '../modules/set';
import {get} from '../modules/get';

describe('object-utils#set', function() {
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

  it('Should set shallow property', function() {
    set(this.data, 'set1', 'set1');
    expect(get(this.data, 'set1')).to.equal('set1');
  });

  it('Should update shallow property', function() {
    set(this.data, 'prop1', 'prop1');
    expect(get(this.data, 'prop1')).to.equal('prop1');
  });

  it('Should set nested property', function() {
    set(this.data, 'prop2.prop1', false);
    expect(get(this.data, 'prop2.prop1')).to.equal(false);
  });

  it('Should create nested path and set value', function() {
    expect(set(this.data, 'noprop.noprop.noprop', 'noprop'));
    expect(get(this.data, 'noprop.noprop.noprop')).to.equal('noprop');
  });
});
