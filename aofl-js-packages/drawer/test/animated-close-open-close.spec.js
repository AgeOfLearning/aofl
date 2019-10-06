/* eslint-disable */
import {Drawer as AoflDrawer} from '../';
import {html, render} from 'lit-html';

describe('@aofl/web-components/aofl-drawer#animated-close', function() {
  before(function() {
    sinon.spy(AoflDrawer.prototype, 'openChanged')
  });

  beforeEach(function() {
    this.testContainer = getTestContainer();

    render(html`
      <style>
        .ease-in {
          opacity: 0;
          transition: opacity 100ms ease-in;
        }

        .ease-in.animate {
          opacity: 1;
        }

        .ease-out {
          opacity: 1;
          transition: opacity 100ms ease-out;
        }

        .ease-out.animate {
          opacity: 0;
        }
      </style>
      <aofl-drawer id="drawerAnimatedClosed" opening="ease-in" closing="ease-out">content</aofl-drawer>
    `, this.testContainer);

    this.elementDrawerAnimatedClosed = this.testContainer.querySelector('#drawerAnimatedClosed');
    this.elementDrawerAnimatedClosed.setAttribute('open', '');
  });

  it('Should call openChanged() twice', async function() {
    await this.elementDrawerAnimatedClosed.updateComplete;

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
