/* eslint no-invalid-this: "off" */
import '../';
import {render, html} from 'lit-html';

describe('@aofl/web-components/aofl-img', function() {
  context('Image is in viewport on page load', function() {
    beforeEach(function() {
      this.testContainer = getTestContainer();
      render(html`
        <aofl-img id="ImageVisibleOnLoad" src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="></aofl-img>
      `, this.testContainer);
      this.element = this.testContainer.querySelector('#ImageVisibleOnLoad');
    });

    it('should have inner img element with property src matching aofl-img:src', async function() {
      await this.element.updateComplete;

      await new Promise((resolve) => {
        setTimeout(() => { // microtask (longer for ie11 :( )
          const renderedSource = this.element.shadowRoot.querySelector('img').src;
          expect(renderedSource).to.be.equal(this.element.src);
          resolve();
        }, 100);
      });
    });

    afterEach(function() {
      cleanTestContainer(this.testContainer);
    });
  });

  context('image is not in viewport on page load', function() {
    beforeEach(function() {
      this.testContainer = getTestContainer();

      const left = -10 * window.innerHeight;

      render(html`
        <aofl-img id="ImageNotVisibleOnLoad" src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" width="100" height="100" style="position: absolute; width: 100px; height: 100px; left: ${left}px; background: blue;"></aofl-img>
      </div>
      `, this.testContainer);

      this.elementOutside = this.testContainer.querySelector('#ImageNotVisibleOnLoad');
    });

    it('should not load the image when element is outside the viewport', async function() {
      await this.elementOutside.updateComplete;
      return await new Promise((resolve, reject) => {
        setTimeout(() => { // microtask
          try {
            const renderedSource = this.elementOutside.shadowRoot.querySelector('img').src;
            expect(renderedSource).to.not.be.equal(this.elementOutside.src);
            return resolve();
          } catch (e) {
            return reject(e);
          }
        }, 100);
      });
    });

    afterEach(function() {
      cleanTestContainer(this.testContainer);
    });
  });
});
