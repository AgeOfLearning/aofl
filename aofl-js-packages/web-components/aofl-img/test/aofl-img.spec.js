/* eslint no-invalid-this: "off" */
import '../';
import {render, html} from 'lit-html';

describe('@aofl/web-components/aofl-img', function() {
  before(function() {
    this.initalWidth = window.innerWidth;
    this.initalHeight = window.innerHeight;

    this.testContainer = getTestContainer();
  });

  beforeEach(function() {
    const top = 3 * this.initalHeight;
    const left = 3 * this.initalWidth;
    render(html`
      <test-fixture id="ImageVisibleOnLoad">
        <template>
          <aofl-img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="></aofl-img>
        </template>
      </test-fixture>

      <test-fixture id="ImageNotVisibleOnLoad">
      <template>
        <aofl-img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" width="100" height="100" style="width: 100px; height: 100px; position: absolute; left: ${left}px; top: ${top}px;"></aofl-img>
      </template>
    </test-fixture>
    `, this.testContainer);
    this.element = fixture('ImageVisibleOnLoad');
    this.elementOutside = fixture('ImageNotVisibleOnLoad');
  });

  afterEach(function() {
    document.documentElement.style.width = this.initialWidth + 'px';
    document.documentElement.style.height = this.initialHeight + 'px';
    window.scrollTo(0, 0);
  });

  // after(function() {
  //   this.testContainer.parentNode.removeChild(this.testContainer);
  // });

  context('Image is in viewport on page load', function() {
    it('should have inner img element with property src matching aofl-img:src', async function() {
      try {
        await new Promise((resolve) => {
          const element = this.element;
          setTimeout(() => {
            const renderedSource = element.shadowRoot.querySelector('img').src;
            expect(renderedSource).to.be.equal(element.src);
            resolve();
          }, 1000);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('image is not in viewport on page load', function() {
    it('should not load the image when element is outside the viewport', async function() {
      try {
        await new Promise((resolve) => {
          const element = this.elementOutside;
          element.updateComplete
          .then(() => {
            const renderedSource = element.shadowRoot.querySelector('img').src;
            expect(renderedSource).to.not.be.equal(element.src);
            resolve();
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
