/* eslint no-invalid-this: "off" */
import {AoflElement} from '../modules/aofl-element';
import {render, html} from 'lit-html';
import {expect} from 'chai';

describe('@aofl/element >> valid style', function() {
  before(function() {
    /** */
    class StyledElement extends AoflElement {
      /** @return {Object} */
      render() {
        return super.render((context, html) => html``, [':host {background: rgb(255, 0, 0);}', ':host {color: rgb(0, 255, 0);}']);
      }
    }

    customElements.define('styled-element', StyledElement);
  });

  beforeEach(function() {
    this.testContainer = getTestContainer();
    render(html`
      <styled-element id="StyledFixture"></styled-element>
    `, this.testContainer);

    this.styledFixture = this.testContainer.querySelector('#StyledFixture');
  });

  it('should create a shadow root', function() {
    expect(typeof this.styledFixture.shadowRoot).to.equal('object');
  });

  it('should have red background', async function() {
    let backgroundColor = '';
    await this.styledFixture.updateComplete;
    backgroundColor = window.getComputedStyle(this.styledFixture).backgroundColor;
    expect(backgroundColor).to.be.equal('rgb(255, 0, 0)');
  });

  it('should have green text color', async function() {
    await this.styledFixture.updateComplete;
    const color = window.getComputedStyle(this.styledFixture).color;
    expect(color).to.be.equal('rgb(0, 255, 0)');
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });
});
