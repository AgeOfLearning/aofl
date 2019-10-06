/* eslint-disable */
import {Store} from '@aofl/store/modules/legacy';
import {AoflElement} from '@aofl/web-components/aofl-element';
import mapStatePropertiesMixin from '../modules/map-state-properties-mixin';
import {render, html} from 'lit-html';

const storeInstance = new Store();

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
        return 'map-state-child-comp';
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
        return 'map-state-parent-comp';
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

  });

  beforeEach(function() {
    this.testContainer = getTestContainer();
    storeInstance.replaceState({
      device: {
        device: 'desktop'
      }
    });

    render(html`
      <map-state-parent-comp id="MapStatePropertiesMixinTest">
        <map-state-child-comp></map-state-child-comp>
      </map-state-parent-comp>
    `, this.testContainer);

    this.element = this.testContainer.querySelector('#MapStatePropertiesMixinTest');
  });

  afterEach(function() {
    cleanTestContainer(this.testContainer);
  });

  context('connectedCallback()', function() {
    it('Should update parent component "device" on state change', async function() {
      try {
        storeInstance.commit({
          namespace: this.sdo.namespace,
          mutationId: 'setDevice',
          payload: 'phone'
        });

        await this.element.updateComplete;
        expect(this.element.device).to.equal('phone');
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('disconnectedCallback()', function() {
    it('Should NOT update parent component "device" on state change', async function() {
      try {
        this.element.removeChild(this.element.querySelector('map-state-child-comp'));

        storeInstance.commit({
          namespace: this.sdo.namespace,
          mutationId: 'setDevice',
          payload: 'tablet'
        });

        await this.element.updateComplete;
        expect(this.element.device).to.equal('desktop');
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
