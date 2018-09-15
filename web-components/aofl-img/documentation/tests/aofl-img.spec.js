/* eslint no-invalid-this: "off" */
import '../../';

describe('@aofl/web-components/aofl-img', function() {
  before(function() {
    this.initalWidth = window.innerWidth;
    this.initalHeight = window.innerHeight;
  });

  afterEach(function() {
    document.documentElement.style.width = this.initialWidth + 'px';
    document.documentElement.style.height = this.initialHeight + 'px';
    window.scrollTo(0, 0);
  });

  context('Image is in viewport on page load', function() {
    before(function() {
      document.getElementById('test-container').innerHTML = `
      <test-fixture id="ImageVisibleOnLoad">
        <template>
          <aofl-img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="></aofl-img>
        </template>
      </test-fixture>
      `;
    });

    beforeEach(function() {
      this.element = fixture('ImageVisibleOnLoad');
    });

    it('should have inner img element with property src matching aofl-img:src', async function() {
      const element = this.element;
      await element.renderComplete;
      const renderedSource = element.shadowRoot.querySelector('img').src;
      expect(renderedSource).to.be.equal(element.src);
    });
  });

  context('image is not in viewport on page load', function() {
    before(function() {
      const top = 3 * this.initalHeight;
      const left = 3 * this.initalWidth;
      document.getElementById('test-container').innerHTML += `
      <test-fixture id="ImageNotVisibleOnLoad">
        <template>
          <aofl-img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" width="100" height="100" style="width: 100px; height: 100px; position: absolute; left: ${left}px; top: ${top}px;"></aofl-img>
        </template>
      </test-fixture>
      `;
    });

    beforeEach(function() {
      this.elementOutside = fixture('ImageNotVisibleOnLoad');
    });

    it('should not load the image when element is outside the viewport', async function() {
      const element = this.elementOutside;
      await element.renderComplete;
      const renderedSource = element.shadowRoot.querySelector('img').src;
      expect(renderedSource).to.not.be.equal(element.src);
    });
  });
});
