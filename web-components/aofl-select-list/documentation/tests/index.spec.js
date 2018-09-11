/* eslint-disable */
import '../../';
import '@aofl/web-components/aofl-list-option';
import { equal } from 'assert';

describe('@aofl/web-components/aofl-select-list', function() {
  beforeEach(function() {
    document.getElementById('test-container').innerHTML =
    `<test-fixture id="ListTestFixtureParent">
      <template>
        <aofl-select-list>
          <aofl-list-option>1</aofl-list-option>
          <aofl-list-option selected="true">2</aofl-list-option>
        </aofl-select-list>
      </template>
    </test-fixture>`;
  });

  beforeEach(function() {
    this.element = fixture('ListTestFixtureParent');
  });

  context('init', function() {
    it('parent should load the component', function() {
      expect(this.element).to.not.be.null;
    });
  });

  context('updateSelected()', function() {
    it('Should update value when a list option is selected', function(done) {
      const children = Array.from(this.element.children).map((item) => {
        return item.renderComplete;
      });

      Promise.all(children).then(() => {
        this.element.querySelector('aofl-list-option').select();
        expect(this.element.value).to.be.equal('1');
        done();
      });
    });
  });

  context('addOption()', function() {
    it('Should call addOption when a new option is added', function(done) {
      const children = Array.from(this.element.children).map((item) => {
        return item.renderComplete;
      });

      Promise.all(children).then(() => {
        let listOption = document.createElement('aofl-list-option');
        this.element.appendChild(listOption);
        listOption.renderComplete.then(() => {
          expect(this.element.options.length).to.be.equal(3);
          done();
        });
      });
    });
  });
});
