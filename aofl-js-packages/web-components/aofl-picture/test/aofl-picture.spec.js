/* eslint no-invalid-this: "off" */
import '../';
import '../../aofl-source';
import '../../aofl-img';
import {render, html} from 'lit-html';

describe('@aofl/web-components/aofl-picture', function() {
  before(function() {
    this.initialWidth = window.innerWidth;
    this.initialHeight = window.innerHeight;


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

      <aofl-picture id="MultipleImg">
        <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
        <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
        <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
        <aofl-img id="main" src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
        <aofl-img src="https://via.placeholder.com/2000x1000" width="1000" height="500"></aofl-img>
      </aofl-picture>

      <aofl-picture id="SourcesDisabled" disable-sources>
        <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
        <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
        <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
        <aofl-img src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
      </aofl-picture>
    `, this.testContainer);

    this.basicPictureElement = this.testContainer.querySelector('#BasicPicture');
    this.multipleImgElement = this.testContainer.querySelector('#MultipleImg');
    this.sourcesDisabledElement = this.testContainer.querySelector('#SourcesDisabled');
  });

  afterEach(function() {
    window.parent.document.querySelector('iframe').style.width = this.initialWidth + 'px';
    window.parent.document.querySelector('iframe').style.height = this.initialHeight + 'px';
    window.parent.document.querySelector('iframe').width = this.initialWidth;
    cleanTestContainer(this.testContainer);
  });

  it('should set the correct source depending on window size', async function() {
    await this.basicPictureElement.updateComplete;
    const src = this.basicPictureElement.querySelector('aofl-img').src;

    expect(src).to.be.equal(this.getSource(window.innerWidth));
  });

  it('should update source when window size changes to 1000px', async function() {
    try {
      const element = this.basicPictureElement;

      window.parent.document.querySelector('iframe').width = 1000;
      element.requestUpdate();

      await element.updateComplete;
      const src = element.querySelector('aofl-img').src;

      expect(src).to.be.equal(this.getSource(window.innerWidth));
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should update source when window size changes to 200px', async function() {
    try {
      const element = this.basicPictureElement;
      window.parent.document.querySelector('iframe').width = 200;

      element.requestUpdate();
      await element.updateComplete;
      const src = element.querySelector('aofl-img').src;

      expect(src).to.be.equal(this.getSource(window.innerWidth));
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should only take the first aofl-img tag', async function() {
    try {
      const element = this.multipleImgElement;
      const mainImg = element.querySelector('#main');
      await element.updateComplete;

      expect(element.img).to.be.equal(mainImg);
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should not update source when window size changes to 1000px and sources-disabled', async function() {
    try {
      const element = this.sourcesDisabledElement;
      window.parent.document.querySelector('iframe').width = 1000;

      element.requestUpdate();
      await element.updateComplete;
      const src = element.querySelector('aofl-img').src;

      expect(src).to.be.equal(this.getSource(1000));
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should not update source when window size changes to 200px and sources-disabled', async function() {
    try {
      const element = this.sourcesDisabledElement;
      window.parent.document.querySelector('iframe').width = 200;

      element.requestUpdate();
      await element.updateComplete;
      const src = element.querySelector('aofl-img').src;

      expect(src).to.be.equal(this.getSource(1000));
    } catch (e) {
      return Promise.reject(e);
    }
  });
});
