/* eslint no-invalid-this: "off" */
import isInViewportMixin from '@aofl/component-utils/src/is-in-viewport-mixin';
import AoflElement from '@aofl/web-components/aofl-element';
import {render, html} from 'lit-html';

describe('@aofl/component-utils/src/is-in-viewport-mixin', function() {
  before(function() {
    this.initialWidth = window.innerWidth;
    this.initialHeight = window.innerHeight;

    /* eslint-disable */
    class TestElement extends isInViewportMixin(AoflElement) {
      constructor() {
        super();
      }
      static get is() {
        return 'test-element';
      }

      firstWithinViewport() {};
      withinViewportUpdated() {};

      render() {
        return super.render((context, html) => html`test content`, [':host {display: block}']);
      }

    };
    /* eslint-enable */

    customElements.define(TestElement.is, TestElement);

    const top = 3 * this.initialHeight;
    const left = 3 * this.initialWidth;
    render(html`
    <test-fixture id="VisibleOnLoad">
      <template>
        <test-element style="width: 100px; height: 100px; background: red;"></test-element>
      </template>
    </test-fixture>
    <test-fixture id="NotVisibleOnLoad">
      <template>
        <test-element style="width: 100px; height: 100px; position: absolute; left: ${left}px; top: ${top}px;"></test-element>
      </template>
    </test-fixture>
    `, document.getElementById('test-container'));
  });

  beforeEach(function() {
    this.element = fixture('VisibleOnLoad');
    this.elementOutside = fixture('NotVisibleOnLoad');

    this.firstWithinViewport = sinon.spy(this.element, 'firstWithinViewport');
    this.withinViewportUpdated = sinon.spy(this.element, 'withinViewportUpdated');

    this.firstWithinViewportOutside = sinon.spy(this.elementOutside, 'firstWithinViewport');
    this.withinViewportUpdatedOutside = sinon.spy(this.elementOutside, 'withinViewportUpdated');
  });

  afterEach(function() {
    console.log('afterEach');
    this.firstWithinViewport.reset();
    this.withinViewportUpdated.reset();
    this.firstWithinViewportOutside.reset();
    this.withinViewportUpdatedOutside.reset();

    document.documentElement.style.width = this.initialWidth + 'px';
    document.documentElement.style.height = this.initialHeight + 'px';
    window.scrollTo(0, 0);
  });

  context('Element is in viewport on page load', function() {
    it('should have property isWithinViewport with value of true', async function() {
      const element = this.element;
      await element.updateComplete;
      expect(this.element).to.have.property('isWithinViewport', true);
    });

    it('should invoke firstWithin Viewport', function(done) {
      const element = this.element;
      this.element.updateComplete.then(() => {
        element.checkInViewport();
        expect(this.firstWithinViewport.called).to.be.true;
        done();
      })
      .catch(done);
    });

    it('should invoke withinViewPortUpdated with newVal=true, oldVal=undefined',
    async function() {
      const element = this.element;
      await element.updateComplete;
      expect(this.withinViewportUpdated.withArgs(true, void 0).calledOnce).to.be.true;
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along the x axis',
    function(done) {
      const newWidth = (3 * this.initialWidth);
      const element = this.element;
      const withinViewportUpdated = this.withinViewportUpdated;
      document.documentElement.style.width = newWidth + 'px';

      window.addEventListener('scroll', function listener() {
        window.removeEventListener('scroll', listener);
        element.updateComplete.then(() => {
          expect(withinViewportUpdated.withArgs(false, true).called).to.be.true;
          done();
        })
        .catch(done);
      });

      setTimeout(() => {
        window.scrollTo(newWidth, 0);
      }, 500);
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along the y axis',
    function(done) {
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.height = newHeight + 'px';
      const element = this.element;
      const withinViewportUpdated = this.withinViewportUpdated;

      setTimeout(() => {
        window.addEventListener('scroll', function listener() {
          window.removeEventListener('scroll', listener);
          element.updateComplete.then(() => {
            expect(withinViewportUpdated.withArgs(false, true).called).to.be.true;
            done();
          })
          .catch(done);
        });

        window.scrollTo(0, newHeight);
      }, 1000);
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls outside of visible area along both x and y axis',
    function(done) {
      const newWidth = (3 * this.initialWidth);
      const newHeight = (3 * this.initialHeight);
      const withinViewportUpdated = this.withinViewportUpdated;
      document.documentElement.style.width = newWidth + 'px';
      document.documentElement.style.height = newHeight + 'px';
      const element = this.element;

      setTimeout(() => {
      window.addEventListener('scroll', function listener() {
        window.removeEventListener('scroll', listener);
        element.updateComplete.then(() => {
          expect(withinViewportUpdated.withArgs(false, true).called).to.be.true;
          done();
        })
        .catch(done);
      });

        window.scrollTo(newWidth, newHeight);
      }, 500);
    });

    it('should invoke withinViewPortUpdated once for each time element changes from being in the visible area to not',
    function(done) {
      const newWidth = (3 * this.initialWidth);
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.width = newWidth + 'px';
      document.documentElement.style.height = newHeight + 'px';
      const element = this.element;
      const withinViewportUpdated = this.withinViewportUpdated;

      setTimeout(() => {
        window.scrollTo(newWidth, newHeight);
      }, 500);


      setTimeout(() => {
        window.addEventListener('scroll', function listener() {
          window.removeEventListener('scroll', listener);
          element.updateComplete.then(() => {
            expect(withinViewportUpdated.calledThrice).to.be.true;
            done();
          })
          .catch(done);
        });
        window.scrollTo(0, 0);
      }, 1000);
    });
  });

  context('Element is outside of the viewport on page load', function() {
    it('should have property isWithinViewport with value of false', async function() {
      await this.elementOutside.updateComplete;
      expect(this.elementOutside).to.have.property('isWithinViewport', false);
    });

    it('should not invoke firstWithinViewport', async function() {
      await this.elementOutside.updateComplete;
      expect(this.firstWithinViewportOutside.called).to.be.false;
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=undefined',
    async function() {
      const elementOutside = this.elementOutside;
      await elementOutside.updateComplete;
      expect(this.withinViewportUpdatedOutside.withArgs(false, void 0).calledOnce).to.be.true;
    });

    it('should invoke withinViewPortUpdated with newVal=true, oldVal=false when element scrolls inside of visible area along the x axis',
    function(done) {
      const newWidth = (4 * this.initialWidth);
      document.documentElement.style.width = newWidth + 'px';
      const elementOutside = this.elementOutside;
      const withinViewportUpdatedOutside = this.withinViewportUpdatedOutside;

      setTimeout(() => {
        window.addEventListener('scroll', function listener() {
          window.removeEventListener('scroll', listener);
          elementOutside.updateComplete.then(() => {
            expect(withinViewportUpdatedOutside.withArgs(true, false).called).to.be.true;
            done();
          })
          .catch(done);
        });
        elementOutside.scrollIntoView();
      }, 500);
    });

    it('should invoke withinViewPortUpdated with newVal=false, oldVal=true when element scrolls inside of visible area along the y axis',
    function(done) {
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.height = newHeight + 'px';
      const elementOutside = this.elementOutside;
      const withinViewportUpdatedOutside = this.withinViewportUpdatedOutside;

      setTimeout(() => {
        window.addEventListener('scroll', function listener() {
          window.removeEventListener('scroll', listener);
          elementOutside.updateComplete.then(() => {
            expect(withinViewportUpdatedOutside.withArgs(true, false).called).to.be.true;
            done();
          })
          .catch(done);
        });
        elementOutside.scrollIntoView();
      }, 500);
    });

    it('should invoke withinViewPortUpdated with newVal=true, oldVal=false when element scrolls inside of visible area along both x and y axis',
    function(done) {
      const newWidth = (3 * this.initialWidth);
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.width = newWidth + 'px';
      document.documentElement.style.height = newHeight + 'px';
      const elementOutside = this.elementOutside;
      const withinViewportUpdatedOutside = this.withinViewportUpdatedOutside;

      setTimeout(() => {
        window.addEventListener('scroll', function listener() {
          window.removeEventListener('scroll', listener);
          elementOutside.updateComplete.then(() => {
            expect(withinViewportUpdatedOutside.withArgs(true, false).called).to.be.true;
            done();
          })
          .catch(done);
        });
        elementOutside.scrollIntoView();
      }, 500);
    });
  });
});
