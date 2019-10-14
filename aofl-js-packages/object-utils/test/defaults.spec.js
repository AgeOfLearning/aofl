/* eslint no-invalid-this: "off" */
import {defaults} from '../modules/defaults';
import {get} from '../modules/get';

describe('object-utils#set', function() {
  beforeEach(function() {
    this.defaults = {
      prop1: 'prop1',
      prop2: {
        prop2prop1: 'prop2prop1',
        prop2prop2: ['prop2prop2']
      },
      prop3: {
        prop3prop1: []
      }
    };
    this.data = {
      prop1: '',
      prop3: {
        prop3prop1: []
      }
    };
  });

  it('Should add default values to object', function() {
    defaults(this.data, this.defaults);

    expect(get(this.data, 'prop1')).to.equal('');
    expect(get(this.data, 'prop2.prop2prop1')).to.equal('prop2prop1');
    expect(get(this.data, 'prop2.prop2prop2')).to.equal(this.defaults.prop2.prop2prop2);
    expect(get(this.data, 'prop3.prop3prop1')).to.equal(this.data.prop3.prop3prop1);
  });
});
