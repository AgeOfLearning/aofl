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
        <aofl-list-option selected>2</aofl-list-option>
      </aofl-select-list>
    `, this.testContainer);

    this.element = this.testContainer.querySelector('#ListTestFixtureParent');
    try {
      await this.element.updateComplete;
      const children = Array.from(this.element.children).map((item) => {
        return item.updateComplete;
      });

      await Promise.all(children);
    } catch (e) {
      return Promise.reject(e)
    }
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });

  context('init', function() {
    it('parent should load the component', function() {
      expect(this.element).to.not.be.null;
    });
  });

  context('keydownCallback()', function() {
    it('should decrement focusIndex and focus list option on up arrow', function() {
      const event = new Event('keydown');
      event.keyCode = 40;
      this.element.dispatchEvent(event);
      event.keyCode = 38;
      const focusIndex = this.element.focusIndex;
      this.element.dispatchEvent(event);

      expect(this.element.focusIndex).to.equal(focusIndex - 1);
    });

    it('should decrement focusIndex and focus list option on shift-tab', function() {
        const event = new Event('keydown');
        event.keyCode = 9;
        this.element.dispatchEvent(event);
        event.shiftKey = true;
        const focusIndex = this.element.focusIndex;
        this.element.dispatchEvent(event);

        expect(this.element.focusIndex).to.equal(focusIndex - 1);
    });

    it('should increment focusIndex and focus list option on down arrow', function() {
      const event = new Event('keydown');
      event.keyCode = 40;
      const focusIndex = this.element.focusIndex;
      this.element.dispatchEvent(event);

      expect(this.element.focusIndex).to.equal(focusIndex + 1);
    });

    it('should increment focusIndex and focus list option on tab', function() {
      const event = new Event('keydown');
      event.keyCode = 9;
      const focusIndex = this.element.focusIndex;
      this.element.dispatchEvent(event);

      expect(this.element.focusIndex).to.equal(focusIndex + 1);
    });

    it('should do nothing on any other keys', function() {
      const event = new Event('keydown');
      event.keyCode = 20;
      const focusIndex = this.element.focusIndex;
      this.element.dispatchEvent(event);

      expect(this.element.focusIndex).to.equal(focusIndex);
    });

    it('should do nothing if attempting to increment at end of options array', function() {
      const event = new Event('keydown');
      event.keyCode = 40;
      this.element.dispatchEvent(event);
      this.element.dispatchEvent(event);
      const focusIndex = this.element.focusIndex;
      this.element.dispatchEvent(event);

      expect(this.element.focusIndex).to.equal(focusIndex);
    });

    it('should do nothing if attempting to decrement at start of options array', function() {
      const event = new Event('keydown');
      event.keyCode = 40;
      this.element.dispatchEvent(event);
      event.keyCode = 38;
      const focusIndex = this.element.focusIndex;
      this.element.dispatchEvent(event);
      this.element.dispatchEvent(event);

      expect(this.element.focusIndex).to.equal(focusIndex - 1);
    });
  });

  context('mouseoverCallback', function() {
    it('should focus list options on hover', function() {
      const e = {
        target: this.element.querySelectorAll('aofl-list-option')[1]
      }
      this.element.mouseoverCallback(e);
      this.element.dispatchEvent(new Event('mouseover'));

      expect(this.element.focusIndex).to.equal(1);
    });
  });

  context('updateSelected()', function() {
    it('Should update value when a list option is selected', function() {
      this.element.querySelector('aofl-list-option').select();
      expect(this.element.value).to.be.equal('1');
    });

    it('should add selected attribute to element', function() {
      this.element.querySelector('aofl-list-option').select();
      expect(this.element.querySelector('aofl-list-option').hasAttribute('selected')).to.be.true;
    });
  });

  context('addOption()', function() {
    it('Should call addOption when a new option is added', async function() {
      let listOption = document.createElement('aofl-list-option');
      this.element.appendChild(listOption);
      await listOption.updateComplete;
      expect(this.element.options.length).to.be.equal(3);
    });
  });
});
