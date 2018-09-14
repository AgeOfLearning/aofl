/* eslint no-invalid-this: "off" */
import AoflElement from '../..';
import {render} from 'lit-html';
import {html} from '@polymer/lit-element';

describe('@aofl/web-components/aofl-element >> invalid style', function() {
  before(function() {
    /** */
    class InvalidStyleElement extends AoflElement {
      /** @return {Object} */
      _render() {
        return super._render((context, html) => html``, ['']);
      };
    }

    customElements.define('invalid-style-element', InvalidStyleElement);
  });

  beforeEach(function() {
    render(html`
      <test-fixture id="InvalidStyleFixture">
        <template>
          <invalid-style-element></invalid-style-element>
        </template>
      </test-fixture>
    `, document.getElementById('test-container'));
    this.invalidStyleFixture = fixture('InvalidStyleFixture');
  });

  it('should skip invalid styles items', function() {
    expect(this.invalidStyleFixture.shadowRoot).to.be.an.object;
  });
});
