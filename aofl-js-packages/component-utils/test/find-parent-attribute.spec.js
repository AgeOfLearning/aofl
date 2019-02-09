/* eslint-disable */
import {findParentByAttributes} from '../modules/traverse-parents';
import {AoflElement} from '@aofl/web-components/aofl-element';
import {render, html} from 'lit-html';

describe('@aofl/component-utils', function() {
  context('findParentByAttribute()', function() {
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
          return 'find-parent-parent-attribute-comp';
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
          return 'find-parent-attribute-child-comp';
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
        <find-parent-parent-attribute-comp my-attribute>
          <find-parent-attribute-child-comp></find-parent-attribute-child-comp>
        </find-parent-parent-attribute-comp>
      `, this.testContainer);

      this.parentElement = this.testContainer.querySelector('find-parent-parent-attribute-comp');
      this.childElement = this.parentElement.querySelector('find-parent-attribute-child-comp');
    });

    afterEach(function() {
      cleanTestContainer(this.testContainer);
    });

    it('Should find the parent', function () {
      expect(findParentByAttributes(this.childElement, 'my-attribute')).to.not.be.false;
    });


    it('Should not find parent with signature and throw error', function() {
      expect(findParentByAttributes(this.childElement, 'not-my-attribute')).to.be.false;
    });
  });
});
