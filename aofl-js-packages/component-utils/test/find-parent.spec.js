/* eslint no-invalid-this: "off" */
import {findParent} from '../modules/traverse-parents';
import {AoflElement} from '@aofl/element';
import {render, html} from 'lit-html';
import {expect} from 'chai';

describe('@aofl/component-utils', function() {
  context('findParent()', function() {
    before(function() {
      class ParentComp extends AoflElement {
        constructor() {
          super();
        }
        static get is() {
          return 'find-parent-parent-comp';
        }
        increment() {}
        render() {
          return super.render((context, html) => html`<slot></slot>`);
        }
      }

      class ChildNestedComp extends AoflElement {
        constructor() {
          super();
          this.foundParent = null;
        }
        static get is() {
          return 'find-parent-child-nested-comp';
        }
        connectedCallback() {
          super.connectedCallback();
          this.foundParent = findParent(this, 'increment');
        }
        render() {
          return super.render((context, html) => html`<slot></slot>`);
        }
      }

      class ChildComp extends AoflElement {
        constructor() {
          super();
        }
        static get is() {
          return 'find-parent-child-comp';
        }
        render() {
          return super.render((context, html) => html`<find-parent-child-nested-comp><slot></slot></find-parent-child-nested-comp>`);
        }
      }

      class ChildChildComp extends AoflElement {
        constructor() {
          super();
          this.foundParent = null;
        }
        static get is() {
          return 'find-parent-child-child-comp';
        }
        connectedCallback() {
          super.connectedCallback();
          this.foundParent = findParent(this, 'increment');
        }
        render() {
          return super.render((context, html) => html`<slot></slot>`);
        }
      }

      customElements.define(ParentComp.is, ParentComp);
      customElements.define(ChildComp.is, ChildComp);
      customElements.define(ChildNestedComp.is, ChildNestedComp);
      customElements.define(ChildChildComp.is, ChildChildComp);
    });

    beforeEach(function() {
      this.testContainer = getTestContainer();
      render(html`
        <find-parent-parent-comp>
          <find-parent-child-comp>
            <div>
              <find-parent-child-child-comp></find-parent-child-child-comp>
            </div>
          </find-parent-child-comp>
        </find-parent-parent-comp>
      `, this.testContainer);

      this.parentElement = this.testContainer.querySelector('find-parent-parent-comp');
      this.childElement = this.parentElement.querySelector('find-parent-child-comp');
      this.childChildElement = this.parentElement.querySelector('find-parent-child-child-comp');
    });

    afterEach(function() {
      cleanTestContainer(this.testContainer);
    });

    it('Should find the parent with specific functions', function() {
      expect(findParent(this.childElement, 'increment')).to.not.be.false;
    });

    it('Should find distance parent with specific functions', async function() {
      await this.childChildElement.updateComplete;
      expect(this.childChildElement.foundParent).to.equal(this.parentElement);
    });

    it('Should not find parent with signature and throw error', function() {
      expect(findParent(this.childElement, 'not-found')).to.be.false;
    });
  });
});
