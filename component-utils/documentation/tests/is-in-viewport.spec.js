/* eslint no-invalid-this: "off" */
import isInViewport from '../../src/is-in-viewport';

describe('@aofl/component-utils/src/is-in-viewport', function() {
  before(function() {
    this.initialWidth = window.innerWidth;
    this.initialHeight = window.innerHeight;
  });

  beforeEach(function() {
    document.getElementById('test-container').innerHTML =
    `<test-fixture id="VisibleOnLoad">
      <template>
        <div style="width: 100px; height: 100px;"></div>
      </template>
    </test-fixture>`;
    this.element = fixture('VisibleOnLoad');
  });

  afterEach(function() {
    document.documentElement.style.width = this.initialWidth + 'px';
    document.documentElement.style.height = this.initialHeight + 'px';
  });

  it('should return true when element is in within the viewport', function() {
    const isVisible = isInViewport(this.element);
    expect(isVisible).to.be.true;
  });

  it('should return false when element is outside of viewport along the x axis', function() {
    const newWidth = (3 * this.initialWidth);
    document.documentElement.style.width = newWidth + 'px';
    window.scrollTo(newWidth, 0);

    const isVisible = isInViewport(this.element);
    expect(isVisible).to.be.false;
  });

  it('should return false when element is outside of viewport along the y axis', function() {
    const newHeight = (3 * this.initialHeight);
    document.documentElement.style.height = newHeight + 'px';
    window.scrollTo(0, newHeight);

    const isVisible = isInViewport(this.element);
    expect(isVisible).to.be.false;
  });

  it('should return false when element is outside of viewport along both x and y axis', function() {
    const newWidth = (3 * this.initialWidth);
    const newHeight = (3 * this.initialHeight);
    document.documentElement.style.width = newWidth + 'px';
    document.documentElement.style.height = newHeight + 'px';
    window.scrollTo(newWidth, newHeight);

    const isVisible = isInViewport(this.element);
    expect(isVisible).to.be.false;
  });

  context('window.inner[Hight|Width] are falsy', function() {
    before(function() {
      window.innerWidth = void 0;
      window.innerHeight = void 0;
    });

    after(function() {
      window.innerWidth = this.initialWidth;
      window.innerHeight = this.initialHeight;
    });

    it('should return true when element is in within the viewport', function() {
      const isVisible = isInViewport(this.element);
      expect(isVisible).to.be.true;
    });

    it('should return false when element is outside of viewport along the x axis', function() {
      const newWidth = (3 * this.initialWidth);
      document.documentElement.style.width = newWidth + 'px';
      window.scrollTo(newWidth, 0);

      const isVisible = isInViewport(this.element);
      expect(isVisible).to.be.false;
    });

    it('should return false when element is outside of viewport along the y axis', function() {
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.height = newHeight + 'px';
      window.scrollTo(0, newHeight);

      const isVisible = isInViewport(this.element);
      expect(isVisible).to.be.false;
    });

    it('should return false when element is outside of viewport along both x and y axis', function() {
      const newWidth = (3 * this.initialWidth);
      const newHeight = (3 * this.initialHeight);
      document.documentElement.style.width = newWidth + 'px';
      document.documentElement.style.height = newHeight + 'px';
      window.scrollTo(newWidth, newHeight);

      const isVisible = isInViewport(this.element);
      expect(isVisible).to.be.false;
    });
  });
});
