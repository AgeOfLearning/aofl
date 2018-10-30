/* eslint-disable */
import '../';
import {html, render} from 'lit-html';

describe('@aofl/web-components/aofl-drawer', function() {
  before(function() {
    const mainTestContainer = document.getElementById('test-container');
    this.testContainer = document.createElement('div');
    mainTestContainer.insertBefore(this.testContainer, mainTestContainer.firstChild);

  });

  beforeEach(function() {
    render(html`
      <style>
      .ease-in {
        opacity: 0;
        transition: opacity 50ms ease-in;
      }

      .ease-in.animate {
        opacity: 1;
      }

      .ease-out {
        opacity: 1;
        transition: opacity 50ms ease-out;
      }

      .ease-out.animate {
        opacity: 0;
      }

      .ease-in-multi {
        opacity: 0;
        background-color: blue;
        transition: opacity 50ms ease-in, background-color 100ms ease-in;
      }

      .ease-in-multi.animate {
        opacity: 1;
        background-color: red;
      }

      .ease-out-multi {
        opacity: 1;
        background-color: red;
        transition: opacity 50ms ease-out, background-color 100ms ease-out;
      }

      .ease-out-multi.animate {
        opacity: 0;
        background-color: blue;
      }
      </style>
      <test-fixture id="drawerNotAnimatedClosed">
        <template>
          <aofl-drawer>
            content
          </aofl-drawer>
        </template>
      </test-fixture>

      <test-fixture id="drawerNotAnimatedOpen">
        <template>
          <aofl-drawer open>
            content
          </aofl-drawer>
        </template>
      </test-fixture>

      <test-fixture id="drawerAnimatedOpen">
        <template>
          <aofl-drawer opening="ease-in" closing="ease-out" open>
            content
          </aofl-drawer>
        </template>
      </test-fixture>

      <test-fixture id="drawerAnimatedClosed">
        <template>
          <aofl-drawer opening="ease-in" closing="ease-out">
            content
          </aofl-drawer>
        </template>
      </test-fixture>

      <test-fixture id="drawerMultiAnimated">
        <template>
          <aofl-drawer opening="ease-in-multi" closing="ease-out-multi" transition-count="2">
            content
          </aofl-drawer>
        </template>
      </test-fixture>
    `, this.testContainer);

    this.elementNotAnimatedOpen = fixture('drawerNotAnimatedOpen');
    this.elementNotAnimatedClosed = fixture('drawerNotAnimatedClosed');
    this.elementDrawerAnimatedOpen = fixture('drawerAnimatedOpen');
    this.elementDrawerAnimatedClosed = fixture('drawerAnimatedClosed');
    this.elementDrawerMultiAnimated = fixture('drawerMultiAnimated');

    this.elementNotAnimatedOpenDispatchSpy = sinon.spy(this.elementNotAnimatedOpen, 'dispatchEvent');
    this.elementNotAnimatedClosedDispatchSpy = sinon.spy(this.elementNotAnimatedClosed, 'dispatchEvent');
  });

  afterEach(function() {
    this.elementNotAnimatedOpenDispatchSpy.restore();
    this.elementNotAnimatedClosedDispatchSpy.restore();
  });
  // after(function() {
  //   this.testContainer.parentNode.removeChild(this.testContainer);
  // });

  it('should trigger change when open attribute is removed', async function() {
    try {
      this.elementNotAnimatedOpen.removeAttribute('close');
      await this.elementNotAnimatedOpen.updateComplete;
      expect(this.elementNotAnimatedOpenDispatchSpy.called).to.be.true;
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should trigger change when open attribute is added', async function() {
    try {
      this.elementNotAnimatedClosed.removeAttribute('close');
      await this.elementNotAnimatedClosed.updateComplete;
      expect(this.elementNotAnimatedClosedDispatchSpy.called).to.be.true;
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('Should remove animation classes after closing', async function() {
    try {
      const elementDrawerAnimatedOpen = this.elementDrawerAnimatedOpen;
      await this.elementDrawerAnimatedOpen.updateComplete;

      await new Promise((resolve) => {
        setTimeout(() => {
          this.elementDrawerAnimatedOpen.addEventListener('change', function listener() {
            elementDrawerAnimatedOpen.removeEventListener('change', listener);
            expect(elementDrawerAnimatedOpen.classList.contains('ease-in')).to.be.true;
            resolve();
          });
          this.elementDrawerAnimatedOpen.removeAttribute('open');
        }, 100);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('Should remove animation classes after opening', async function() {
    try {
      const elementDrawerAnimatedClosed = this.elementDrawerAnimatedClosed;
      await this.elementDrawerAnimatedClosed.updateComplete;
      await new Promise((resolve) => {
        setTimeout(() => {
          this.elementDrawerAnimatedClosed.addEventListener('change', function listener() {
            elementDrawerAnimatedClosed.removeEventListener('change', listener);
            expect(elementDrawerAnimatedClosed.classList.contains('ease-out')).to.be.true;
            resolve();
          });
          this.elementDrawerAnimatedClosed.setAttribute('open', 'open');
        }, 100);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should dispatch change when all animations finish', async function() {
    try {
      const elementDrawerMultiAnimated = this.elementDrawerMultiAnimated;
      await this.elementDrawerMultiAnimated.updateComplete;
      let initTime = null;
      await new Promise((resolve) => {
        setTimeout(() => {
          this.elementDrawerMultiAnimated.addEventListener('change', function listener() {
            const delta = Date.now() - initTime;
            elementDrawerMultiAnimated.removeEventListener('change', listener);
            expect(delta).to.be.above(100);
            resolve();
          });
          initTime = Date.now();
          this.elementDrawerMultiAnimated.setAttribute('open', 'open');
        });
      }, 100);
    } catch (e) {
      return Promise.reject(e);
    }
  });
});
