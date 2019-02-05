/* eslint no-invalid-this: "off" */
import isInViewportMixin from '../src/is-in-viewport-mixin';
import {AoflElement} from '@aofl/web-components/aofl-element';
import {render, html} from 'lit-html';

describe('@aofl/component-utils/src/is-in-viewport-mixin', function() {
  before(function() {
    /* eslint-disable */
    class TestElement extends isInViewportMixin(AoflElement) {
      constructor() {
        super();
      }
      static get is() {
        return 'is-in-viewport-mixin-element';
      }

      withinViewportUpdated() {};

      render() {
        return super.render((context, html) => html`test content`, [':host {display: block}']);
      }

    };
    /* eslint-enable */

    customElements.define(TestElement.is, TestElement);
  });

  beforeEach(function() {
    this.testContainer = getTestContainer();
    render(html`
        <is-in-viewport-mixin-element id="ViewportMixinVisibleOnLoad" style="position: absolute; top: 0; left: 0; width: 100px; height: 100px; background: blue;"></is-in-viewport-mixin-element>
        <is-in-viewport-mixin-element id="ViewportMixinNotVisibleOnLoad" style="width: 100px; height: 100px; position: absolute; left: -10000px; top: -10000px;"></is-in-viewport-mixin-element>
    `, this.testContainer);

    this.element = this.testContainer.querySelector('#ViewportMixinVisibleOnLoad');
    this.elementOutside = this.testContainer.querySelector('#ViewportMixinNotVisibleOnLoad');

    this.firstWithinViewport = sinon.spy(this.element, 'firstWithinViewport');
    this.withinViewportUpdated = sinon.spy(this.element, 'withinViewportUpdated');
    this.firstWithinViewportOutside = sinon.spy(this.elementOutside, 'firstWithinViewport');
    this.withinViewportUpdatedOutside = sinon.spy(this.elementOutside, 'withinViewportUpdated');
  });

  afterEach(function() {
    this.firstWithinViewport.restore();
    this.withinViewportUpdated.restore();
    this.firstWithinViewportOutside.restore();
    this.withinViewportUpdatedOutside.restore();

    this.element.style.left = '0';
    this.element.style.top = '0';
    this.elementOutside.style.left = '-10000px';
    this.elementOutside.style.top = '-10000px';
    cleanTestContainer(this.testContainer);
  });

  context('Element is in viewport on page load', function() {
    it('should have property isWithinViewport with value of true', async function() {
      try {
        await this.element.updateComplete;
        expect(this.element).to.have.property('isWithinViewport', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke firstWithin Viewport', async function() {
      try {
        await this.element.updateComplete;
        expect(this.firstWithinViewport.called).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke withinViewPortUpdated with newVal=true, oldVal=undefined',
      async function() {
        try {
          await this.element.updateComplete;
          expect(this.withinViewportUpdated.withArgs(true, void 0).calledOnce).to.be.true;
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along the x axis',
      async function() {
        try {
          await this.element.updateComplete;
          this.element.style.left = '-10000px';
          window.dispatchEvent(new CustomEvent('scroll'));
          await this.element.updateComplete;
          expect(this.withinViewportUpdated.withArgs(false, true).called).to.be.true;
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along the y axis',
      async function() {
        try {
          await this.element.updateComplete;
          this.element.style.top = '-10000px';

          window.dispatchEvent(new CustomEvent('scroll'));
          await this.element.updateComplete;
          expect(this.withinViewportUpdated.withArgs(false, true).called).to.be.true;
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along both x and y axis',
      async function() {
        try {
          await this.element.updateComplete;

          this.element.style.left = '-10000px';
          this.element.style.top = '-10000px';

          window.dispatchEvent(new CustomEvent('scroll'));
          await this.element.updateComplete;
          expect(this.withinViewportUpdated.withArgs(false, true).called).to.be.true;
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should invoke withinViewPortUpdated once for each time element changes from being in the visible area to not',
      async function() {
        try {
          await this.element.updateComplete;

          this.element.style.left = '-10000px';
          this.element.style.top = '-10000px';
          window.dispatchEvent(new CustomEvent('scroll'));

          await this.element.updateComplete;

          this.element.style.left = '0';
          this.element.style.top = '0';
          window.dispatchEvent(new CustomEvent('scroll'));

          await this.element.updateComplete;
          expect(this.withinViewportUpdated.calledThrice).to.be.true;
        } catch (e) {
          return Promise.reject(e);
        }
      });
  });

  context('Element is outside of the viewport on page load', function() {
    it('should have property isWithinViewport with value of false', async function() {
      try {
        await this.elementOutside.updateComplete;
        expect(this.elementOutside).to.have.property('isWithinViewport', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should not invoke firstWithinViewport', async function() {
      try {
        await this.elementOutside.updateComplete;
        expect(this.firstWithinViewportOutside.called).to.be.false;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=undefined',
      async function() {
        try {
          await this.elementOutside.updateComplete;
          expect(this.withinViewportUpdatedOutside.withArgs(false, void 0).calledOnce).to.be.true;
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should invoke withinViewPortUpdated with newVal=true, oldVal=false when element scrolls inside of visible area',
      async function() {
        try {
          await this.elementOutside.updateComplete;

          this.elementOutside.style.left = '0';
          this.elementOutside.style.top = '0';
          window.dispatchEvent(new CustomEvent('scroll'));

          await this.elementOutside.updateComplete;

          expect(this.withinViewportUpdatedOutside.withArgs(true, false).called).to.be.true;
        } catch (e) {
          return Promise.reject(e);
        }
      });
  });
});
