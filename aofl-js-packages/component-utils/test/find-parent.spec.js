/* eslint-disable */
import findParent from '../src/find-parent';
import AoflElement from '@aofl/web-components/aofl-element';
import {render, html} from 'lit-html';

describe('@aofl/component-utils', function() {
  context('findParent()', function() {
    before(function() {
      class ParentComp extends AoflElement {
        constructor() {
          super();
          this.count = 0;
        }
        static get properties() {
          return {
            count: {type: Number}
          }
        }
        static get is() {
          return 'find-parent-parent-comp';
        }
        incrementCount(amount) {
          this.count += amount;
        }
        render() {
          return super.render((context, html) => html`<slot></slot>`);
        }
      }

      class ChildComp extends AoflElement {
        constructor() {
          super();
          this.incrementAmount = 5;
          this.incrementParent = this.incrementParent.bind(this);
          this.parentMethodSignature = ['incrementCount'];
        }
        static get is() {
          return 'find-parent-child-comp';
        }
        incrementParent() {
          this.parent = findParent(this, ...this.parentMethodSignature);
          if (this.parent) {
            this.parent.incrementCount(this.incrementAmount);
          }
        }
        render() {
          return super.render((context, html) => html``);
        }
      }

      customElements.define(ParentComp.is, ParentComp);
      customElements.define(ChildComp.is, ChildComp);
    });

    beforeEach(function() {
      this.testContainer = getTestContainer();
      render(html`
        <find-parent-parent-comp>
          <find-parent-child-comp></find-parent-child-comp>
        </find-parent-parent-comp>
      `, this.testContainer);

      this.parentElement = this.testContainer.querySelector('find-parent-parent-comp');
      this.childElement = this.parentElement.querySelector('find-parent-child-comp');
    });

    afterEach(function() {
      cleanTestContainer(this.testContainer);
    });

    it('Should find the parent and invoke its method', function () {

      this.childElement.incrementParent();
      expect(this.parentElement.count).to.equal(5);
    });

    it('Should throw a TypeError', function () {
      expect(findParent).to.throw();
    });

    it('Should not find parent with signature and throw error', function() {
      this.childElement.parentMethodSignature = ['foo'];
      expect(this.childElement.incrementParent).to.throw();
    });
  });
});
