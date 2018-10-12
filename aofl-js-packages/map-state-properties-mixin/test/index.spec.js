/* eslint-disable */
import {storeInstance} from '@aofl/store';
import AoflElement from '@aofl/web-components/aofl-element';
import mapStatePropertiesMixin from '../src/map-state-properties-mixin';
import {render, html} from 'lit-html';

describe('@aofl/map-state-properties-mixin', function() {
  before(function() {
    this.sdo = {
      namespace: 'device',
      mutations: {
        init() {
          return {
            device: 'desktop'
          }
        },
        setDevice(subState, device) {
          return Object.assign({}, subState, {device});
        }
      }
    };
    storeInstance.addState(this.sdo);

    class ChildComp extends mapStatePropertiesMixin(AoflElement) {
      constructor() {
        super();
        this.storeInstance = storeInstance;
        this.device = 'desktop';
      }
      static get is() {
        return 'child-comp';
      }
      mapStateProperties() {
        const state = this.storeInstance.getState();
        this.parentNode.device = state.device.device;
      }
      render() {
        return super.render((context, html) => html`<p>Current device: ${context.device}</p>`);
      }
    }

    class ParentComp extends AoflElement {
      constructor() {
        super();
        this.device = 'desktop';
      }

      static get is() {
        return 'parent-comp';
      }

      render() {
        return super.render((context, html) => html`
          <p>Current device: ${context.device}</p>
        `);
      }
    }

    if (!customElements.get(ChildComp.is)) {
      customElements.define(ChildComp.is, ChildComp);
    }
    if (!customElements.get(ParentComp.is)) {
      customElements.define(ParentComp.is, ParentComp);
    }

    render(html`
      <test-fixture id="MapStatePropertiesMixinTest">
        <template>
          <parent-comp>
            <child-comp></child-comp>
          </parent-comp>
        </template>
      </test-fixture>
    `, document.getElementById('test-container'));
  });

  beforeEach(function() {
    this.element = fixture('MapStatePropertiesMixinTest');
  });

  it('should be true', function() {
    expect(true).to.be.true;
  });

  context('connectedCallback()', function() {
    it('Should update parent component "device" on state change', async function() {
      try {
        await new Promise((resolve) => {
          const unsubscribe = storeInstance.subscribe(() => {
            expect(this.element.device).to.equal('phone');
            unsubscribe();
            resolve();
          });

          storeInstance.commit({
            namespace: this.sdo.namespace,
            mutationId: 'setDevice',
            payload: 'phone'
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('disconnectedCallback()', function() {
    it('Should NOT update parent component "device" on state change', async function() {
      try {
        await new Promise((resolve) => {
          this.element.removeChild(this.element.querySelector('child-comp'));
          const unsubscribe = storeInstance.subscribe(() => {
            expect(this.element.device).to.equal('desktop');
            unsubscribe();
            resolve();
          });

          storeInstance.commit({
            namespace: this.sdo.namespace,
            mutationId: 'setDevice',
            payload: 'tablet'
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
