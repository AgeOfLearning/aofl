/* eslint-disable */
import '../../';
import '@aofl/web-components/aofl-select-list';

describe('@aofl/web-components/aofl-select-list', function() {
  beforeEach(function() {
    document.getElementById('test-container').innerHTML =
    `<test-fixture id="ListTestFixture">
      <template>
        <aofl-select-list>
          <aofl-list-option>1</aofl-list-option>
        </aofl-select-list>
      </template>
    </test-fixture>
    <test-fixture id="ListTestFixture2">
      <template>
        <aofl-select-list>
          <aofl-list-option selected="true">1</aofl-list-option>
        </aofl-select-list>
      </template>
    </test-fixture>`;
  });

  beforeEach(function() {
    this.element = fixture('ListTestFixture');
    this.element2 = fixture('ListTestFixture2');
  });

  context('init', function() {
    it('parent should load the component', function() {
      expect(this.element).to.not.be.null;
    });
  });

  context('connectedCallback()', function() {
    it('Should set selected when selected="true" attribute is given', function(done) {
      const children = Array.from(this.element2.children).map((item) => {
        return item.updateComplete;
      });

      Promise.all(children).then(() => {
        expect(this.element2.querySelector('aofl-list-option').getAttribute('selected')).to.be.equal('true');
        done();
      });
    });

    it('Should set listElement a parent with addOption', function(done) {
      const children = Array.from(this.element.children).map((item) => {
        return item.updateComplete;
      });

      Promise.all(children).then(() => {
        expect(this.element.querySelector('aofl-list-option').listElement).to.not.be.undefined;
        done();
      });
    });
  });

  context('select()', function() {
    it('Should set attribute true to selected', function(done) {
      const children = Array.from(this.element.children).map((item) => {
        return item.updateComplete;
      });

      Promise.all(children).then(() => {
        this.element.querySelector('aofl-list-option').click();
        expect(this.element.querySelector('aofl-list-option').getAttribute('selected')).to.be.equal('true');
        done();
      });
    });
  });
});
