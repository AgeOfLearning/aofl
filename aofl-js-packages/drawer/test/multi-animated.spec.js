/* eslint-disable */
import AoflDrawer from '../modules/drawer';
import {html, render} from 'lit-html';

describe('@aofl/web-components/aofl-drawer#multi-animation', function() {
  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`
      <style>
      .ease-in-multi {
        opacity: 0;
        background-color: blue;
        transition: opacity 10ms ease-in, background-color 20ms ease-in;
      }

      .ease-in-multi.animate {
        opacity: 1;
        background-color: red;
      }

      .ease-out-multi {
        opacity: 1;
        background-color: red;
        transition: opacity 10ms ease-out, background-color 20ms ease-out;
      }

      .ease-out-multi.animate {
        opacity: 0;
        background-color: blue;
      }
      </style>
      <aofl-drawer id="drawerMultiAnimated" opening="ease-in-multi" closing="ease-out-multi" transition-count="2">content</aofl-drawer>
    `, this.testContainer);

    this.elementDrawerMultiAnimated = this.testContainer.querySelector('#drawerMultiAnimated');
  });

  it('should dispatch change when all animations finish', async function() {
    const elementDrawerMultiAnimated = this.elementDrawerMultiAnimated;
    await elementDrawerMultiAnimated.updateComplete;

    let initTime = 0;
    await new Promise((resolve) => {
      this.elementDrawerMultiAnimated.addEventListener('drawer-toggle', function listener() {
        const delta = Date.now() - initTime;
        elementDrawerMultiAnimated.removeEventListener('drawer-toggle', listener);
        expect(delta).to.be.above(19);
        resolve();
      });
      initTime = Date.now();

      this.elementDrawerMultiAnimated.setAttribute('open', '');
    });
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });
});
