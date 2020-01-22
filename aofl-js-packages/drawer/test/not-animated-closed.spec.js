/* eslint no-invalid-this: "off" */
import AoflDrawer from '../modules/drawer';
import {html, render} from 'lit-html';
import {expect} from 'chai';
import sinon from 'sinon';

describe('@aofl/drawer#not-animated-closed', function() {
  before(function() {
    sinon.spy(AoflDrawer.prototype, 'dispatchEvent');
  });

  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`<aofl-drawer id="drawerNotAnimatedClosed">content</aofl-drawer>`, this.testContainer);

    this.elementNotAnimatedClosed = this.testContainer.querySelector('#drawerNotAnimatedClosed');
  });

  it('should trigger change when open attribute is added', async function() {
    this.elementNotAnimatedClosed.setAttribute('open', open);
    await this.elementNotAnimatedClosed.updateComplete;
    expect(this.elementNotAnimatedClosed.dispatchEvent.called).to.be.true;
  });

  afterEach(function() {
    AoflDrawer.prototype.dispatchEvent.resetHistory();
    cleanTestContainer(this.testContainer);
  });

  after(function() {
    AoflDrawer.prototype.dispatchEvent.restore();
  });
});
