/* eslint no-invalid-this: "off" */
import '../../';
import '../../../aofl-source';
import '../../../aofl-img';

describe('@aofl/web-components/aofl-picture', function() {
  before(function() {
    this.initialWidth = window.innerWidth;
    this.initialHeight = window.innerHeight;

    document.getElementById('test-container').innerHTML = `
    <test-fixture id="BasicPicture">
    <template>
      <aofl-picture>
        <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
        <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
        <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
        <aofl-img src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
      </aofl-picture>
    </template>
    </test-fixture>

    <test-fixture id="MultipleImg">
    <template>
      <aofl-picture>
        <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
        <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
        <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
        <aofl-img id="main" src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
        <aofl-img src="https://via.placeholder.com/2000x1000" width="1000" height="500"></aofl-img>
      </aofl-picture>
    </template>
    </test-fixture>

    <test-fixture id="SourcesDisabled">
    <template>
      <aofl-picture disable-sources>
        <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
        <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
        <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
        <aofl-img src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
      </aofl-picture>
    </template>
    </test-fixture>
    `;

    this.getSource = (windowWidth) => {
      if (windowWidth <= 300) {
        return 'https://via.placeholder.com/300x150';
      } else if (windowWidth <= 500) {
        return 'https://via.placeholder.com/500x250';
      } else if (windowWidth <= 700) {
        return 'https://via.placeholder.com/700x350';
      } else {
        return 'https://via.placeholder.com/1000x500';
      }
    };
  });

  beforeEach(function() {
    this.basicPictureElement = fixture('BasicPicture');
    this.multipleImgElement = fixture('MultipleImg');
    this.sourcesDisabledElement = fixture('SourcesDisabled');
  });

  afterEach(function() {
    window.innerWidth = this.initialWidth;
    window.innerHeight = this.initialHeight;
    window.parent.document.querySelector('iframe').width = this.initialWidth;
  });

  it('should set the correct source depending on window size', async function() {
    await this.basicPictureElement.renderComplete;
    const src = this.basicPictureElement.querySelector('aofl-img').src;

    expect(src).to.be.equal(this.getSource(window.innerWidth));
  });

  it('should update source when window size changes to 1000px', function(done) {
    const element = this.basicPictureElement;
    const _this = this;
    element.renderComplete.then(() => {
      window.addEventListener('resize', function resizeListener() {
        window.removeEventListener('resize', resizeListener);
        element.renderComplete.then(() => {
          const src = element.querySelector('aofl-img').src;

          expect(src).to.be.equal(_this.getSource(window.innerWidth));
          done();
        });
      });

      window.parent.document.querySelector('iframe').width = 1000;
      window.dispatchEvent(new Event('resize'));
    });
  });

  it('should update source when window size changes to 200px', function(done) {
    const element = this.basicPictureElement;
    const _this = this;
    element.renderComplete.then(() => {
      window.addEventListener('resize', function resizeListener() {
        window.removeEventListener('resize', resizeListener);
        element.renderComplete.then(() => {
          const src = element.querySelector('aofl-img').src;

          expect(src).to.be.equal(_this.getSource(window.innerWidth));
          done();
        });
      });

      window.parent.document.querySelector('iframe').width = 200;
      window.dispatchEvent(new Event('resize'));
    });
  });

  it('should only take the first aofl-img tag', async function() {
    const element = this.multipleImgElement;
    const mainImg = element.querySelector('#main');
    await element.renderComplete;

    expect(element.img).to.be.equal(mainImg);
  });

  it('should not update source when window size changes to 1000px and sources-disabled', function(done) {
    const element = this.sourcesDisabledElement;
    const _this = this;
    element.renderComplete.then(() => {
      window.addEventListener('resize', function resizeListener() {
        window.removeEventListener('resize', resizeListener);
        element.renderComplete.then(() => {
          const src = element.querySelector('aofl-img').src;

          expect(src).to.be.equal(_this.getSource(1000));
          done();
        });
      });

      window.parent.document.querySelector('iframe').width = 1000;
      window.dispatchEvent(new Event('resize'));
    });
  });

  it('should not update source when window size changes to 200px and sources-disabled', function(done) {
    const element = this.sourcesDisabledElement;
    const _this = this;
    element.renderComplete.then(() => {
      window.addEventListener('resize', function resizeListener() {
        window.removeEventListener('resize', resizeListener);
        element.renderComplete.then(() => {
          const src = element.querySelector('aofl-img').src;

          expect(src).to.be.equal(_this.getSource(1000));
          done();
        });
      });

      window.parent.document.querySelector('iframe').width = 200;
      window.dispatchEvent(new Event('resize'));
    });
  });
});
