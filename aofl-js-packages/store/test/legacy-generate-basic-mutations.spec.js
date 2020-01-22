/* eslint no-invalid-this: "off" */
import {expect} from 'chai';
import {generateMutations} from '../modules/legacy/generate-basic-mutations';

describe('@aofl/store/modules/generate-basic-mutations', function() {
  beforeEach(function() {
    this.state = {
      firstName: '',
      lastName: ''
    };
    this.mutations = generateMutations(this.state);
  });
  it('Should add set[Key] mutations to config', function() {
    expect(this.mutations).to.have.all.keys('setFirstName', 'setLastName');
  });

  it('Should return a new state object', function() {
    const state = this.mutations.setFirstName(this.state, 'Mike');
    expect(state).to.not.equal(this.state);
  });

  it('Should return a new object with the property set', function() {
    const state = this.mutations.setFirstName(this.state, 'Mike');
    expect(state).to.have.property('firstName', 'Mike');
  });
});
