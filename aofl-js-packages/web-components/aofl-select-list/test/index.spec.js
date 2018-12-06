/* eslint-disable */
import '../';
import '../../aofl-list-option';
import {render, html} from 'lit-html';

describe('@aofl/web-components/aofl-select-list', function() {
  beforeEach(async function() {
    this.testContainer = getTestContainer();

    render(html`
      <aofl-select-list id="ListTestFixtureParent">
        <aofl-list-option>1</aofl-list-option>
        <aofl-list-option selected="true">2</aofl-list-option>
      </aofl-select-list>
    `, this.testContainer);

    this.element = this.testContainer.querySelector('#ListTestFixtureParent');
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });

  context('init', function() {
    it('parent should load the component', function() {
      expect(this.element).to.not.be.null;
    });
  });

  context('updateSelected()', function() {
    it('Should update value when a list option is selected', async function() {
      try {
        const children = Array.from(this.element.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        this.element.querySelector('aofl-list-option').select();
        expect(this.element.value).to.be.equal('1');
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('addOption()', function() {
    it('Should call addOption when a new option is added', async function() {
      try {
        const children = Array.from(this.element.children).map((item) => {
          return item.updateComplete;
        });

        await Promise.all(children);
        let listOption = document.createElement('aofl-list-option');
        this.element.appendChild(listOption);
        await listOption.updateComplete;
        expect(this.element.options.length).to.be.equal(3);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
