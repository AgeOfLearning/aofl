/* eslint no-invalid-this: "off" */
import '../modules/picture';
import '../modules/source';
import '../modules/image';
import {render, html} from 'lit-html';
import {expect} from 'chai';

describe('@aofl/picture', function() {
  before(function() {
    this.initialWidth = window.outerWidth;
    this.initialHeight = window.outerHeight;


    this.getSource = (windowWidth) => {
      if (windowWidth <= 300) {
        return 'https://via.placeholder.com/300x150';
      } else if (windowWidth <= 500) {
        return 'https://via.placeholder.com/500x250';
      } else if (windowWidth <= 700) {
        return 'https://via.placeholder.com/700x350';
      }
      return 'https://via.placeholder.com/1000x500';
    };
  });

  beforeEach(function() {
    this.testContainer = getTestContainer();
    render(html`
      <aofl-picture id="BasicPicture">
        <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
        <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
        <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
        <aofl-img src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
      </aofl-picture>
    `, this.testContainer);

    this.basicPictureElement = this.testContainer.querySelector('#BasicPicture');
  });

  afterEach(function() {
    window.document.documentElement.outerWidth = this.initialWidth;
    window.document.documentElement.outerHeight = this.initialHeight;
  });

  it('should set the correct source depending on window size', async function() {
    await this.basicPictureElement.updateComplete;
    const src = this.basicPictureElement.querySelector('aofl-img').src;
    expect(src).to.be.equal(this.getSource(window.outerWidth));
  });

  it('should update source when window size changes to 1000px', async function() {
    try {
      const element = this.basicPictureElement;

      window.document.documentElement.outerWidth = 1000;
      element.requestUpdate();

      await element.updateComplete;
      const src = element.querySelector('aofl-img').src;

      expect(src).to.be.equal(this.getSource(window.outerWidth));
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should update source when window size changes to 200px', async function() {
    try {
      const element = this.basicPictureElement;
      window.document.documentElement.outerWidth = 200;

      element.requestUpdate();
      await element.updateComplete;
      const src = element.querySelector('aofl-img').src;

      expect(src).to.be.equal(this.getSource(window.outerWidth));
    } catch (e) {
      return Promise.reject(e);
    }
  });
});
