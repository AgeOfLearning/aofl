import HomeElement from '../index';

describe('HomeElement class', function desc() {
  it('should have a is attribute with value home-page', function it() {
    expect(HomeElement.is).to.equal('home-page');
  });
});
