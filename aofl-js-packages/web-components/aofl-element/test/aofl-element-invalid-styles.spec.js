/* eslint no-invalid-this: "off" */
import AoflElement from '../';
import {render, html} from 'lit-html';

describe('@aofl/web-components/aofl-element >> invalid style', function() {
  before(function() {
    /** */
    class InvalidStyleElement extends AoflElement {
      /** @return {Object} */
      render() {
        return super.render((context, html) => html``, ['']);
      };
    }

    customElements.define('invalid-style-element', InvalidStyleElement);
  });

  beforeEach(function() {
    this.testContainer = getTestContainer();
    render(html`
      <invalid-style-element id="InvalidStyleFixture"></invalid-style-element>
    `, this.testContainer);

    this.invalidStyleFixture = this.testContainer.querySelector('#InvalidStyleFixture');
  });


  it('should skip invalid styles items', function() {
    expect(typeof this.invalidStyleFixture.shadowRoot).to.equal('object');
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });
});
