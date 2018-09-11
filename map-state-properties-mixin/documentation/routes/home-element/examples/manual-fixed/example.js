/* eslint-disable */
const storeInstance = new Store();
let parentNode = null;
const colors = [
  '#b82d0a',
  '#c3b3e2',
  '#5cbd34',
  '#1519bb',
  '#aeb18e',
  '#dfd8cb',
  '#aa7cb1',
  '#c9cf40',
  '#8f62f4',
  '#30a86f',
  '#1c9632',
  '#825321',
  '#fa75b2',
  '#b40852',
  '#c20a05',
  '#e76f31',
  '#49aac8',
  '#0bd95c',
  '#7acfc3',
  '#efa0bc',
  '#9a685d'
];

const sdo = {
  namespace: 'color',
  mutations: {
    init() {
      return {
        color: ''
      };
    },
    setColor(subState, color) {
      return Object.assign({}, subState, {color});
    }
  }
};

storeInstance.addState(sdo);




///////////////////////////////////////////////////////////////////////////////////////
class ManualFixedComponent extends AoflElement {
  static get is() {
    return 'manual-fixed';
  }

  connectedCallback() {
    super.connectedCallback();

    this.unsubscribe = storeInstance.subscribe(() => this.mapStateProperties()); // keep reference to unsubscribe
  }

  mapStateProperties() {
    const state = storeInstance.getState();
    parentNode.style.background = state.color.color;
  };

  _render() {
    return super._render(() => ``, []);
  }

  disconnectedCallback() {
    this.unsubscribe(); // unsubscribe from store
    super.disconnectedCallback();
  }
};
///////////////////////////////////////////////////////////////////////////////////////

if (!customElements.get(ManualFixedComponent.is)) {
  customElements.define(ManualFixedComponent.is, ManualFixedComponent);
}

context.updateColor = () => {
  storeInstance.commit({
    namespace: 'color',
    mutationId: 'setColor',
    payload: colors[Math.round(Math.random() * colors.length)]
  });
};

let component = document.createElement(ManualFixedComponent.is);
context.attached = false;
context.attachDetach = (e) => {
  if (context.attached) {
    context.attached = false;
    component.parentNode.removeChild(component);
  } else {
    context.attached = true;
    parentNode = e.target.parentNode;
    e.target.parentNode.appendChild(component);
  }
};
