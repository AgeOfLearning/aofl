/* eslint-disable */
import AoflDrawer from '../modules/drawer';
import {html, render} from 'lit-html';

describe('@aofl/drawer#animated-close', function() {
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
