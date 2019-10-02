/* eslint-disable */
import '../';
import '../../aofl-list-option';
import {render, html} from 'lit-html';

describe('@aofl/web-components/aofl-multiselect-list', function() {
  beforeEach(async function() {
    this.testContainer = getTestContainer();

    render(html`
      <aofl-multiselect-list id="ListTestFixtureParent">
        <aofl-list-option>0</aofl-list-option>
        <aofl-list-option>1</aofl-list-option>
        <aofl-list-option selected>2</aofl-list-option>
      </aofl-multiselect-list>
    `, this.testContainer);
    this.element = this.testContainer.querySelector('#ListTestFixtureParent');

    try {
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

  context('focusoutCallback()', function() {
    it('should reset focusIndex when losing focus', function() {
      expect(this.element.focusIndex).to.be.equal(0);
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

      expect(this.element.focusIndex).to.eql(1);
    });
  });

  context('updateSelected()', function() {
    it('should add value to selected array', function() {
      this.element.children[1].select();
      expect(this.element.selected).to.eql(['1', '2']);
    });

    it('should add selected attribute to element', function(done) {
      this.element.querySelector('aofl-list-option').select();
      setTimeout(() => {
        expect(this.element.querySelector('aofl-list-option').hasAttribute('selected')).to.be.true;
        done();
      }, 100);
    });

    it('should remove value from selected array', function(done) {
      this.element.children[2].select();
      setTimeout(() => {
        expect(this.element.selected.length).to.equal(0);
        done();
      }, 100);
    });

    it('should remove selected attribute from element', function(done) {
      this.element.querySelector('aofl-list-option:last-of-type').select();
      setTimeout(() => {
        this.element.querySelector('aofl-list-option:last-of-type').select();
        setTimeout(() => {
          expect(this.element.querySelector('aofl-list-option:last-of-type').hasAttribute('selected')).to.be.true;
          done();
        }, 100);
      }, 100);
    });
  });

  context('clearSelected()', function() {
    it('Should remove all selected values', function() {
      this.element.clearSelected();
      expect(this.element.selected.length).to.be.equal(0);
    });
  });

  context('addOption()', function() {
    it('Should call addOption when a new option is added', async function() {
      let listOption = document.createElement('aofl-list-option');
      this.element.appendChild(listOption);
      await listOption.updateComplete;
      expect(this.element.options.length).to.be.equal(4);
    });
  });
});
