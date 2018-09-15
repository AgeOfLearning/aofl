/* eslint no-invalid-this: "off" */
import isInViewportMixin from '@aofl/component-utils/src/is-in-viewport-mixin';
import AoflElement from '@aofl/web-components/aofl-element';

describe('@aofl/component-utils/src/is-in-viewport', function() {
  before(function() {
    this.initialWidth = window.innerWidth;
    this.initialHeight = window.innerHeight;

    /* eslint-disable */
    class TestElement extends isInViewportMixin(AoflElement) {
      constructor() {
        super();
        this.firstWithinViewport = sinon.spy();
        this.withinViewportUpdated = sinon.spy();
      }
      static get is() {
        return 'test-element';
      }

      _render() {
        return super._render((context, html) => html`test content`, [':host {display: block}']);
      }

    };
    /* eslint-enable */

    customElements.define(TestElement.is, TestElement);
  });

  afterEach(function() {
    document.documentElement.style.width = this.initialWidth + 'px';
    document.documentElement.style.height = this.initialHeight + 'px';
    window.scrollTo(0, 0);
  });

  context('Element is in viewport on page load', function() {
    before(function() {
      document.getElementById('test-container').innerHTML =
      `<test-fixture id="VisibleOnLoad">
      <template>
      <test-element style="width: 100px; height: 100px; background: red;"></test-element>
      </template>
      </test-fixture>`;
    });

    beforeEach(function() {
      this.element = fixture('VisibleOnLoad');
    });

    afterEach(function() {
      this.element.firstWithinViewport.reset();
      this.element.withinViewportUpdated.reset();
    });

    it('should have property isWithinViewport with value of true', async function() {
      const element = this.element;
      await element.renderComplete;
      expect(this.element).to.have.property('isWithinViewport', true);
    });

    it('should invoke firstWithin Viewport', function(done) {
      const element = this.element;
      this.element.renderComplete.then(() => {
        element.checkInViewport();
        expect(element.firstWithinViewport.called).to.be.true;
        done();
      });
    });

    it('should invoke withinViewPortUpdated with newVal=true, oldVal=undefined',
    async function() {
      const element = this.element;
      await element.renderComplete;
      expect(element.withinViewportUpdated.withArgs(true, void 0).calledOnce).to.be.true;
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along the x axis',
    function(done) {
      const newWidth = (3 * this.initialWidth);
      const element = this.element;
      document.documentElement.style.width = newWidth + 'px';

      window.addEventListener('scroll', function listener() {
        window.removeEventListener('scroll', listener);
        element.renderComplete.then(() => {
          expect(element.withinViewportUpdated.withArgs(false, true).called).to.be.true;
          done();
        });
      });

      window.scrollTo(newWidth, 0);
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along the y axis',
    function(done) {
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.height = newHeight + 'px';
      const element = this.element;

      window.addEventListener('scroll', function listener() {
        window.removeEventListener('scroll', listener);
        element.renderComplete.then(() => {
          expect(element.withinViewportUpdated.withArgs(false, true).called).to.be.true;
          done();
        });
      });

      window.scrollTo(0, newHeight);
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along both x and y axis',
    function(done) {
      const newWidth = (3 * this.initialWidth);
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.width = newWidth + 'px';
      document.documentElement.style.height = newHeight + 'px';
      const element = this.element;

      window.addEventListener('scroll', function listener() {
        window.removeEventListener('scroll', listener);
        element.renderComplete.then(() => {
          expect(element.withinViewportUpdated.withArgs(false, true).called).to.be.true;
          done();
        });
      });

      window.scrollTo(newWidth, newHeight);
    });

    it('should invoke withinViewPortUpdated once for each time element changes from being in the visible area to not',
    function(done) {
      const newWidth = (3 * this.initialWidth);
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.width = newWidth + 'px';
      document.documentElement.style.height = newHeight + 'px';
      const element = this.element;

      window.scrollTo(newWidth, newHeight);

      setTimeout(() => {
        window.addEventListener('scroll', function listener() {
          window.removeEventListener('scroll', listener);
          element.renderComplete.then(() => {
            expect(element.withinViewportUpdated.calledThrice).to.be.true;
            done();
          });
        });

        window.scrollTo(0, 0);
      }, 1000);
    });
  });

  context('Element is outside of the viewport on page load', function() {
    before(function() {
      const top = 3 * this.initialHeight;
      const left = 3 * this.initialWidth;
      document.getElementById('test-container').innerHTML +=
      `<test-fixture id="NotVisibleOnLoad">
      <template>
      <test-element style="width: 100px; height: 100px; position: absolute; left: ${left}px; top: ${top}px;"></test-element>
      </template>
      </test-fixture>`;
    });

    beforeEach(function() {
      this.elementOutside = fixture('NotVisibleOnLoad');
    });

    afterEach(function() {
      this.elementOutside.firstWithinViewport.reset();
      this.elementOutside.withinViewportUpdated.reset();
    });

    it('should have property isWithinViewport with value of false', function() {
      expect(this.elementOutside).to.have.property('isWithinViewport', false);
    });

    it('should not invoke firstWithinViewport', async function() {
      await this.elementOutside.renderComplete;
      expect(this.elementOutside.firstWithinViewport.called).to.be.false;
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=undefined',
    async function() {
      const elementOutside = this.elementOutside;
      await elementOutside.renderComplete;
      expect(elementOutside.withinViewportUpdated.withArgs(false, void 0).calledOnce).to.be.true;
    });

    it('should invoke withinViewPortUpdated with newVal=true, oldVal=false when element scrolls inside of visible area along the x axis',
    function(done) {
      const newWidth = (4 * this.initialWidth);
      document.documentElement.style.width = newWidth + 'px';
      const elementOutside = this.elementOutside;

      window.addEventListener('scroll', function listener() {
        window.removeEventListener('scroll', listener);
        elementOutside.renderComplete.then(() => {
          expect(elementOutside.withinViewportUpdated.withArgs(true, false).called).to.be.true;
          done();
        });
      });
      elementOutside.scrollIntoView();
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls inside of visible area along the y axis',
    function(done) {
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.height = newHeight + 'px';
      const elementOutside = this.elementOutside;

      window.addEventListener('scroll', function listener() {
        window.removeEventListener('scroll', listener);
        elementOutside.renderComplete.then(() => {
          expect(elementOutside.withinViewportUpdated.withArgs(true, false).called).to.be.true;
          done();
        });
      });
      elementOutside.scrollIntoView();
    });

    it('should invoke withinViewPortUpdated with newVal=true, oldVal=false when element scrolls inside of visible area along both x and y axis',
    function(done) {
      const newWidth = (3 * this.initialWidth);
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.width = newWidth + 'px';
      document.documentElement.style.height = newHeight + 'px';
      const elementOutside = this.elementOutside;

      window.addEventListener('scroll', function listener() {
        window.removeEventListener('scroll', listener);
        elementOutside.renderComplete.then(() => {
          expect(elementOutside.withinViewportUpdated.withArgs(true, false).called).to.be.true;
          done();
        });
      });
      elementOutside.scrollIntoView();
    });
  });
});
