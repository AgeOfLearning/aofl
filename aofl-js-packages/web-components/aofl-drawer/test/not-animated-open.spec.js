/* eslint-disable */
import AoflDrawer from '../';
import {html, render} from 'lit-html';

describe('@aofl/web-components/aofl-drawer#not-animated-open', function() {
  before(function() {
    sinon.spy(AoflDrawer.prototype, 'dispatchEvent');
  });

  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`<aofl-drawer id="drawerNotAnimatedOpen" open>content</aofl-drawer>`, this.testContainer);

      this.elementNotAnimatedOpen = this.testContainer.querySelector('#drawerNotAnimatedOpen');
  });

  it('should trigger change when open attribute is removed', async function() {
    this.elementNotAnimatedOpen.removeAttribute('open');
    await this.elementNotAnimatedOpen.updateComplete;
    expect(this.elementNotAnimatedOpen.dispatchEvent.called).to.be.true;
  });

  afterEach(function() {
    AoflDrawer.prototype.dispatchEvent.resetHistory();
    cleanTestContainer(this.testContainer);
  });

  after(function() {
    AoflDrawer.prototype.dispatchEvent.restore();
  })
});
