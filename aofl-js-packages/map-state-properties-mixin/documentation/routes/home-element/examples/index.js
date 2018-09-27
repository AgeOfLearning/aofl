/* eslint-disable */
const NAMESPACE = 'TOGGLE_TEST';
storeInstance.addState({
  namespace: NAMESPACE,
  mutations: {
    init(payload) {
      return payload || {
        drawer: false
      };
    },
    toggle(state, payload) {
      return Object.assign({}, payload);
    }
  }
});

context.drawer = false;

storeInstance.subscribe(() => {
  const state = storeInstance.getState();
  context.drawer = state[NAMESPACE].drawer;
});

context.toggleDrawer = (toggle) => {
  toggle = !toggle;
  storeInstance.commit({
    namespace: NAMESPACE,
    mutationId: 'toggle',
    payload: {
      drawer: toggle
    }
  });
};
const template = (context, html) => html`
  <aofl-drawer open$="${context.drawer}">
    Hello I'm a drawer :)
  </aofl-drawer>
`;
class MyComponent extends mapStatePropertiesMixin(AoflElement) {
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.drawer = false;
  }

  static get is() {
    return 'my-component';
  }

  static get properties () {
    return {
      drawer: Boolean
    }
  }

  mapStateProperties() {
    const state = this.storeInstance.getState();
    this.drawer = state[NAMESPACE].drawer;
  }

  _render() {
    return super._render(template, []);
  }
}

window.customElements.define(MyComponent.is, MyComponent);
