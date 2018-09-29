/* eslint-disable */
import '../';
import {html, render} from 'lit-html';

describe('@aofl/web-components/aofl-drawer', function() {
  beforeEach(function() {
    render(html`
    <style>
    .ease-in {
      opacity: 0;
      transition: opacity 250ms ease-in;
    }

    .ease-in.animate {
      opacity: 1;
    }

    .ease-out {
      opacity: 1;
      transition: opacity 250ms ease-out;
    }

    .ease-out.animate {
      opacity: 0;
    }
    </style>
    <test-fixture id="drawerTestFixtureParent">
      <template>
        <aofl-drawer opening="ease-in" closing="ease-out">
          content
        </aofl-drawer>
      </template>
    </test-fixture>

    <test-fixture id="drawerTestFixtureParent1">
      <template>
        <aofl-drawer opening="ease-in" closing="ease-out">
          content
        </aofl-drawer>
      </template>
    </test-fixture>

    <test-fixture id="drawerTestFixtureParent2">
      <template>
        <aofl-drawer opening="ease-in" closing="ease-out" .open="true">
          content
        </aofl-drawer>
      </template>
    </test-fixture>`, document.getElementById('test-container'));
  });

  beforeEach(function() {
    this.element = fixture('drawerTestFixtureParent');
    this.element1 = fixture('drawerTestFixtureParent1');
    this.element2 = fixture('drawerTestFixtureParent2');
  });

  context('init', function() {
    it('parent should load the component', function() {
      expect(this.element).to.not.be.null;
    });
  });

  context('animationEndHandler() closing', function() {
    it('Should remove animation classes after closing', function(done) {
      const element = this.element;
      this.element.updateComplete.then(() => {
        this.element.addEventListener('change', function listener(e) {
          element.removeEventListener('change', listener);

          element.addEventListener('change', function listener1(e) {
            element.removeEventListener('change', listener1);
            console.log('element.classList', element.classList);
            expect(element.classList.contains('ease-out')).to.be.false;
            expect(element.classList.contains('ease-in')).to.be.true;
            done();
          });
          element.open = false;
        });
        element.open = true;
      });
    });
  });


  context('animationEndHandler() opening', function() {
    it('Should remove animation classes after opening', function(done) {
      const element1 = this.element1;
      this.element1.updateComplete.then(() => {
        this.element1.addEventListener('change', function listener(e) {
          element1.removeEventListener('change', listener);
          expect(element1.classList.contains('animate')).to.be.false;
          done();
        });
        this.element1.open = true;
      });
    });
  });

  context('openChanged()', function() {
    it('Should not add classes if passed invalid attribute values', function () {
      this.element2.open = true;
      this.element2.openChanged();
      expect(this.element2.classList.contains('ease-out')).to.be.false;
    });
  });
});
