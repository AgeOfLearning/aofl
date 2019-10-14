/* eslint-disable */
import '../modules/list-option';
import '../modules/select-list';
import {render, html} from 'lit-html';

describe('@aofl/picture/aofl-list-option', function() {
  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`
      <aofl-select-list id="ListTestFixture">
        <aofl-list-option>1</aofl-list-option>
      </aofl-select-list>

      <aofl-select-list id="ListTestFixture2">
        <aofl-list-option selected>1</aofl-list-option>
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
    it('Should set selected when selected attribute is given', async function() {
      try {
        await this.element2.updateComplete;
        const children = Array.from(this.element2.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        expect(this.element2.querySelector('aofl-list-option').hasAttribute('selected')).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should set listElement a parent with addOption', async function() {
      try {
        await this.element.updateComplete;
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

  context('keydownCallback()', function() {
    it('should select element on enter', async function() {
      try {
        await this.element.updateComplete;
        const children = Array.from(this.element.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        const listOptionElement = this.element.querySelector('aofl-list-option');
        const event = new Event('keydown');
        event.keyCode = 13;

        listOptionElement.keydownCallback(event);

        expect(listOptionElement.hasAttribute('selected')).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should select element on space', async function() {
      try {
        await this.element.updateComplete;

        const children = Array.from(this.element.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);

        const listOptionElement = this.element.querySelector('aofl-list-option');

        const event = new Event('keydown');
        event.keyCode = 32;

        listOptionElement.keydownCallback(event);

        expect(listOptionElement.hasAttribute('selected')).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should not select element keydown unless space or enter', async function() {
      try {
        await this.element.updateComplete;
        const children = Array.from(this.element.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        const listOptionElement = this.element.querySelector('aofl-list-option');
        const event = new Event('keydown');
        event.keyCode = 20;

        listOptionElement.keydownCallback(event);

        expect(listOptionElement.hasAttribute('selected')).to.be.false;
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('select()', function() {
    it('Should set attribute true to selected', async function() {
      try {
        await this.element.updateComplete;
        const children = Array.from(this.element.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        const listOptionElement = this.element.querySelector('aofl-list-option');

        listOptionElement.select();
        expect(listOptionElement.hasAttribute('selected')).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
