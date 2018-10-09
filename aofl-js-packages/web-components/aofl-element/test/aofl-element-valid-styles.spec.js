/* eslint no-invalid-this: "off" */
import AoflElement from '../';
import {render, html} from 'lit-html';

describe('@aofl/web-components/aofl-element >> valid style', function() {
  before(function() {
    /** */
    class StyledElement extends AoflElement {
      /** @return {Object} */
      render() {
        return super.render((context, html) => html``, [':host {background: rgb(255, 0, 0);}', ':host {color: rgb(0, 255, 0);}']);
      };
    }

    customElements.define('styled-element', StyledElement);

    this.testContainer = getTestContainer();
  });

  beforeEach(function() {
    render(html`
      <test-fixture id="StyledFixture">
        <template>
          <styled-element></styled-element>
        </template>
      </test-fixture>
    `, this.testContainer);
    this.styledFixture = fixture('StyledFixture');
  });

  // after(function() {
  //   this.testContainer.parentNode.removeChild(this.testContainer);
  // });

  it('should create a shadow root', function() {
    expect(typeof this.styledFixture.shadowRoot).to.equal('object');
  });

  it('should create a shadow root', function() {
    expect(typeof this.styledFixture.shadowRoot).to.equal('object');
  });

  it('should have red background', async function() {
    let backgroundColor = '';
    try {
      this.styledFixture.requestUpdate();
      await this.styledFixture.updateComplete;
      backgroundColor = window.getComputedStyle(this.styledFixture).backgroundColor;
      expect(backgroundColor).to.be.equal('rgb(255, 0, 0)');
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should have green text color', async function() {
    try {
      this.styledFixture.requestUpdate();
      await this.styledFixture.updateComplete;
      const color = window.getComputedStyle(this.styledFixture).color;
      expect(color).to.be.equal('rgb(0, 255, 0)');
    } catch (e) {
      return Promise.reject(e);
    }
  });
});
