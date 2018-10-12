/* eslint no-invalid-this: "off" */
import isInViewport from '../src/is-in-viewport';
import {html} from '@polymer/lit-element';
import {render} from 'lit-html';

describe('@aofl/component-utils/src/is-in-viewport', function() {
  before(function() {
    render(html`
      <test-fixture id="VisibleOnLoad">
        <template>
          <div style="position: absolute; left: 0; top: 0; width: 100px; height: 100px; background: red;"></div>
        </template>
      </test-fixture>
    `, document.getElementById('test-container'));
  });

  beforeEach(function() {
    this.element = fixture('VisibleOnLoad');
  });

  afterEach(async function() {
    this.element.style.left = '0';
    this.element.style.top = '0';
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  });

  it('should return true when element is in within the viewport', function() {
    const isVisible = isInViewport(this.element);
    expect(isVisible).to.be.true;
  });

  it('should return false when element is outside of viewport along the x axis', async function() {
    try {
      await new Promise((resolve) => {
        this.element.style.left = '-100000px';

        setTimeout(() => {
          const isVisible = isInViewport(this.element);
          expect(isVisible).to.be.false;
          resolve();
        }, 500);
      });
    } catch (e) {
      Promise.reject(e);
    }
  });

  it('should return false when element is outside of viewport along the y axis', async function() {
    try {
      await new Promise((resolve) => {
        this.element.style.top = '-100000px';

        setTimeout(() => {
          const isVisible = isInViewport(this.element);
          expect(isVisible).to.be.false;
          resolve();
        }, 500);
      });
    } catch (e) {
      Promise.reject(e);
    }
  });

  it('should return false when element is outside of viewport along both x and y axis', async function() {
    try {
      await new Promise((resolve) => {
        this.element.style.top = '-100000px';
        this.element.style.left = '-100000px';

        setTimeout(() => {
          const isVisible = isInViewport(this.element);
          expect(isVisible).to.be.false;
          resolve();
        }, 500);
      });
    } catch (e) {
      Promise.reject(e);
    }
  });
});
