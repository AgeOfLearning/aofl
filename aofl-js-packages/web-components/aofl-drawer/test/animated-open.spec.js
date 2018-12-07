/* eslint-disable */
import AoflDrawer from '../';
import {html, render} from 'lit-html';

describe('@aofl/web-components/aofl-drawer#animated-open', function() {
  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`
      <style>
        .ease-in {
          opacity: 0;
          transition: opacity 1ms ease-in;
        }

        .ease-in.animate {
          opacity: 1;
        }

        .ease-out {
          opacity: 1;
          transition: opacity 1ms ease-out;
        }

        .ease-out.animate {
          opacity: 0;
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
