/* eslint-disable */
import '../';
import '@aofl/web-components/aofl-select-list';
import {render, html} from 'lit-html';

describe('@aofl/web-components/aofl-select-list', function() {
  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`
      <aofl-select-list id="ListTestFixture">
        <aofl-list-option>1</aofl-list-option>
      </aofl-select-list>

      <aofl-select-list id="ListTestFixture2">
        <aofl-list-option selected="true">1</aofl-list-option>
      </aofl-select-list>
    `, this.testContainer);

    this.element = this.testContainer.querySelector('#ListTestFixture');
    this.element2 = this.testContainer.querySelector('#ListTestFixture2');
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });

  context('init', function() {
    it('parent should load the component', function() {
      expect(this.element).to.not.be.null;
    });
  });

  context('connectedCallback()', function() {
    it('Should set selected when selected="true" attribute is given', async function() {
      try {
        const children = Array.from(this.element2.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        expect(this.element2.querySelector('aofl-list-option').getAttribute('selected')).to.be.equal('true');
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should set listElement a parent with addOption', async function() {
      try {
        const children = Array.from(this.element.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        expect(this.element.querySelector('aofl-list-option').listElement).to.not.be.undefined;
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('select()', function() {
    it('Should set attribute true to selected', async function() {
      try {
        const children = Array.from(this.element.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        this.element.querySelector('aofl-list-option').click();
        expect(this.element.querySelector('aofl-list-option').getAttribute('selected')).to.be.equal('true');
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
