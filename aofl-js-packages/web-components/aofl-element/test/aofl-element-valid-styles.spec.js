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
  });

  before(function() {
    render(html`
      <test-fixture id="StyledFixture">
        <template>
          <styled-element></styled-element>
        </template>
      </test-fixture>
    `, document.getElementById('test-container'));
  });

  beforeEach(function() {
    this.styledFixture = fixture('StyledFixture');
  });

  it('should create a shadow root', function() {
    expect(typeof this.styledFixture.shadowRoot).to.equal('object');
  });

  it('should create a shadow root', function() {
    expect(typeof this.styledFixture.shadowRoot).to.equal('object');
  });

  it('should have red background', async function() {
    let backgroundColor = '';
    try {
      await Promise.resolve(this.styledFixture.updateComplete);
      backgroundColor = window.getComputedStyle(this.styledFixture).backgroundColor;
    } catch (e) {}
    expect(backgroundColor).to.be.equal('rgb(255, 0, 0)');
  });

  it('should have green text color', async function() {
    await this.styledFixture.updateComplete;
    const color = window.getComputedStyle(this.styledFixture).color;
    expect(color).to.be.equal('rgb(0, 255, 0)');
  });
});
