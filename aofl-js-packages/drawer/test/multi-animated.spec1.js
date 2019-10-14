/* eslint-disable */
import AoflDrawer from '../modules/drawer';
import {html, render} from 'lit-html';

describe('@aofl/drawer#multi-animation', function() {
  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`
      <style>
      .ease-in-multi {
		    color: red;
        background-color: blue;
        -webkit-transition: color 50ms ease-in, background-color 100ms ease-in;
        transition: color 50ms ease-in, background-color 100ms ease-in;
      }

      .ease-in-multi.animate {
		    color: blue;
        background-color: red;
      }

      .ease-out-multi {
      	color: blue;
        background-color: red;
        -webkit-transition: color 50ms ease-out, background-color 100ms ease-out;
        transition: color 50ms ease-out, background-color 100ms ease-out;
      }

      .ease-out-multi.animate {
		    color: red;
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
        const delta = Math.round(Date.now() - initTime);
        elementDrawerMultiAnimated.removeEventListener('drawer-toggle', listener);
        expect(delta).to.be.above(90);
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
