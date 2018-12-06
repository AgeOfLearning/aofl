/* eslint-disable */
import AoflDrawer from '../';
import {html, render} from 'lit-html';

describe('@aofl/web-components/aofl-drawer#animated-close', function() {
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
      <aofl-drawer id="drawerAnimatedClosed" opening="ease-in" closing="ease-out">content</aofl-drawer>
    `, this.testContainer);

    this.elementDrawerAnimatedClosed = this.testContainer.querySelector('#drawerAnimatedClosed');
  });

  it('Should remove animation classes after opening', async function() {
      const elementDrawerAnimatedClosed = this.elementDrawerAnimatedClosed;
      await elementDrawerAnimatedClosed.updateComplete;

      await new Promise((resolve) => {
        elementDrawerAnimatedClosed.addEventListener('drawer-toggle', function listener() {
          elementDrawerAnimatedClosed.removeEventListener('drawer-toggle', listener);
          expect(elementDrawerAnimatedClosed.classList.contains('ease-out')).to.be.true;
          resolve();
        });

        elementDrawerAnimatedClosed.setAttribute('open', '');
      });
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });
});
