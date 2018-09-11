/* eslint-disable */
import '../../';
import { equal } from 'assert';

describe('@aofl/web-components/aofl-drawer', function() {
  beforeEach(function() {
    document.getElementById('test-container').innerHTML =
    `<style>
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
        <aofl-drawer opening="ease-in" closing="ease-out" open="false">
          content
        </aofl-drawer>
      </template>
    </test-fixture>
    <test-fixture id="drawerTestFixtureParent2">
      <template>
        <aofl-drawer opening="ease-in" closing="ease-out" open="true">
          content
        </aofl-drawer>
      </template>
    </test-fixture>`;
  });

  beforeEach(function() {
    this.element = fixture('drawerTestFixtureParent');
    this.element2 = fixture('drawerTestFixtureParent2');
  });

  context('init', function() {
    it('parent should load the component', function() {
      expect(this.element).to.not.be.null;
    });
  });

  context('animationEndHandler()', function() {
    it('Should remove animation classes after opening', function(done) {
      this.element.renderComplete.then(() => {
        this.element.setAttribute('open', 'true');
        this.element.style.display = 'inline-block';
        this.element.addEventListener('aofl-drawer-change', (e) => {
          expect(Array.from(this.element.classList).indexOf('animate')).to.be.equal(-1);
          done();
        });
      });
    });

    it('Should remove animation classes after closing', function(done) {
      this.element.renderComplete.then(() => {
        this.element.setAttribute('open', 'true');
        this.element.addEventListener('aofl-drawer-change', (e) => {
          this.element.setAttribute('open', 'false');
        });
        setTimeout(() => {
          expect(Array.from(this.element.classList).indexOf('ease-out')).to.not.equal(-1);
          expect(Array.from(this.element.classList).indexOf('ease-in')).to.be.equal(-1);
          done();
        }, 1000);
      });
    });
  });

  context('openChanged()', function() {
    it('Should not add classes if passed invalid attribute values', function () {
      this.element2.setAttribute('open', 'true');
      this.element2.openChanged('false', undefined);
      expect(Array.from(this.element2.classList).indexOf('ease-out')).to.be.equal(-1);
    });
  });
});
