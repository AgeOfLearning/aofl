/* eslint no-invalid-this: "off" */
import {deepAssign} from '../';

describe('object-utils#deepAssign', function() {
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

  it('should return an object', function() {
    const newData = deepAssign(this.data, '', {});

    expect(typeof newData).to.equal('object');
  });

  it('should act like object.assign when path is an empty string', function() {
    const newData = deepAssign(this.data, '', {
      prop4: {}
    });

    expect(newData).to.have.property('prop4');
  });

  it('should create a new object', function() {
    const newData = deepAssign(this.data, '', {});

    expect(newData).to.not.equal(this.data);
  });

  it('should copy object\'s properties by reference', function() {
    const newData = deepAssign(this.data, '', {});

    expect(newData.prop1).to.equal(this.data.prop1);
  });

  it('should replace object\'s properties based on path and payload', function() {
    const newData = deepAssign(this.data, '', {
      prop1: {}
    });

    expect(newData.prop1).to.not.equal(this.data.prop1);
  });

  it('should replace object\'s nested properties based on path and payload', function() {
    const newData = deepAssign(this.data, 'prop3.prop1.prop1', {});

    expect(newData.prop3.prop1.prop1).to.not.equal(this.data.prop3.prop1.prop1);
    expect(newData.prop3.prop1.prop2).to.equal(this.data.prop3.prop1.prop2);
  });
});
