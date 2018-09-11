/* eslint-disable */
import {storeInstance} from '@aofl/store';
import AoflElement from '@aofl/web-components/aofl-element';
import mapStatePropertiesMixin from '../../src/map-state-properties-mixin';
import {html} from '@polymer/lit-element';
import {render} from 'lit-html';

describe('@aofl/map-state-properties-mixin', function() {
  beforeEach(function() {
    this.sdo = {
      namespace: 'device',
      mutations: {
        init() {
          return {
            device: 'desktop'
          }
        },
        setDevice(state, device) {
          return Object.assign({}, state, {device});
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
      _render() {
        return super._render((context, html) => html`<p>Current device: ${context.device}</p>`);
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
      _render() {
        return super._render((context, html) => html`
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
    this.childComponent = document.createElement(ChildComp.is);
  });
  beforeEach(function() {
    render(html`
      <test-fixture id="MapStatePropertiesMixinTest">
        <template>
          <parent-comp>
          </parent-comp>
        </template>
      </test-fixture>
    `, document.getElementById('test-container'));
  });

  beforeEach(function() {
    this.element = fixture('MapStatePropertiesMixinTest');
    this.element.appendChild(this.childComponent);
  });
  context('connectedCallback()', function() {
    it('Should update parent component "device" on state change', function(done) {
      const unsubscribe = storeInstance.subscribe(() => {
        expect(this.element.device).to.equal('phone');
        unsubscribe();
        done();
      });

      storeInstance.commit({
        namespace: this.sdo.namespace,
        mutationId: 'setDevice',
        payload: 'phone'
      });
    });
  });

  context('disconnectedCallback()', function() {
    it('Should NOT update parent component "device" on state change', function(done) {
      this.element.removeChild(this.childComponent);
      const unsubscribe = storeInstance.subscribe(() => {
        expect(this.element.device).to.equal('desktop');
        unsubscribe();
        done();
      });

      storeInstance.commit({
        namespace: this.sdo.namespace,
        mutationId: 'setDevice',
        payload: 'tablet'
      });
    });
  });
});
