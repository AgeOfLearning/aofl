/* eslint no-invalid-this: "off" */
import '../modules/drawer';
import {html, render} from 'lit-html';
import {expect} from 'chai';

describe('@aofl/drawer#animated-open', function() {
  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`
      <style>
        .ease-in {
          color: blue;
          transition: color 10ms ease-in;
        }

        .ease-in.animate {
          color: red;
        }

        .ease-out {
          color: red;
          transition: color 10ms ease-out;
        }

        .ease-out.animate {
          color: blue;
        }
      </style>
      <aofl-drawer id="drawerAnimatedOpen" opening="ease-in" closing="ease-out" open>content</aofl-drawer>
    `, this.testContainer);

    this.elementDrawerAnimatedOpen = this.testContainer.querySelector('#drawerAnimatedOpen');
  });

  it('Should remove animation classes after closing', async function() {
    const elementDrawerAnimatedOpen = this.elementDrawerAnimatedOpen;
    await elementDrawerAnimatedOpen.updateComplete;

    await new Promise((resolve) => {
      elementDrawerAnimatedOpen.addEventListener('drawer-toggle', function listener() {
        elementDrawerAnimatedOpen.removeEventListener('drawer-toggle', listener);
        expect(elementDrawerAnimatedOpen.classList.contains('ease-in')).to.be.true;
        resolve();
      });

      setTimeout(() => {
        elementDrawerAnimatedOpen.removeAttribute('open');
      }, 100);
    });
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });
});
