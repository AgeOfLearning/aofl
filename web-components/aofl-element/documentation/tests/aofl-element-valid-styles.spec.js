/* eslint no-invalid-this: "off" */
import AoflElement from '../..';
import {render} from 'lit-html';
import {html} from '@polymer/lit-element';

describe('@aofl/web-components/aofl-element >> valid style', function() {
  before(function() {
    /** */
    class StyledElement extends AoflElement {
      /** @return {Object} */
      _render() {
        return super._render((context, html) => html``, [':host {background: rgb(255, 0, 0);}', ':host {color: rgb(0, 255, 0);}']);
      };
    }

    customElements.define('styled-element', StyledElement);
  });

  beforeEach(function() {
    render(html`
      <test-fixture id="StyledFixture">
        <template>
          <styled-element></styled-element>
        </template>
      </test-fixture>
    `, document.getElementById('test-container'));
    this.styledFixture = fixture('StyledFixture');
  });

  it('should create a shadow root', function() {
    expect(this.styledFixture.shadowRoot).to.be.an.object;
  });

  it('should have red background', function() {
    const backgroundColor = window.getComputedStyle(this.styledFixture).backgroundColor;
    expect(backgroundColor).to.be.equal('rgb(255, 0, 0)');
  });

  it('should have green text color', function() {
    const color = window.getComputedStyle(this.styledFixture).color;
    expect(color).to.be.equal('rgb(0, 255, 0)');
  });
});
