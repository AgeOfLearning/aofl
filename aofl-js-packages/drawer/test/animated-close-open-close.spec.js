/* eslint no-invalid-this: "off" */
import AoflDrawer from '../modules/drawer';
import {html, render} from 'lit-html';
import {expect} from 'chai';
import sinon from 'sinon';

describe('@aofl/drawer#animated-close', function() {
  before(function() {
    sinon.spy(AoflDrawer.prototype, 'openChanged');
  });

  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`
      <style>
        .ease-in {
          color: blue;
          transition: color 1ms ease-in;
        }

        .ease-in.animate {
          color: red;
        }

        .ease-out {
          color: red;
          transition: color 1ms ease-out;
        }

        .ease-out.animate {
          color: blue;
        }
      </style>
      <aofl-drawer id="drawerAnimatedClosed" opening="ease-in" closing="ease-out">content</aofl-drawer>
    `, this.testContainer);

    this.elementDrawerAnimatedClosed = this.testContainer.querySelector('#drawerAnimatedClosed');
  });

  it('Should call openChanged() twice', async function() {
    await this.elementDrawerAnimatedClosed.updateComplete;
    this.elementDrawerAnimatedClosed.setAttribute('open', '');

    await new Promise((resolve) => {
      setTimeout(() => {
        this.elementDrawerAnimatedClosed.removeAttribute('open');
        setTimeout(() => {
          expect(this.elementDrawerAnimatedClosed.openChanged.calledTwice).to.be.true;
          resolve();
        }, 50);
      }, 50);
    });
  });

  afterEach(function() {
    AoflDrawer.prototype.openChanged.resetHistory();
    cleanTestContainer(this.testContainer);
  });

  after(function() {
    AoflDrawer.prototype.openChanged.restore();
  });
});
