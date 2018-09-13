/* eslint-disable */

class ParentComp extends AoflElement {
  constructor() {
    super();
    this.count = 0;
  }
  static get properties() {
    return {
      count: Number
    }
  }
  static get is() {
    return 'parent-comp';
  }
  incrementCount(amount) {
    this.count += amount;
  }
  _render() {
    return super._render((context, html) => html`
      <h2>Parent class</h2>
      <p>Count: ${this.count}</p>
      <slot></slot>
    `);
  }
}

// import {findParent} from '@aofl/component-utils'; // do not uncomment

class ChildComp extends AoflElement {
  constructor() {
    super();
    this.incrementAmount = 5;
    this.incrementParent = this.incrementParent.bind(this);
  }
  static get is() {
    return 'child-comp';
  }
  incrementParent() {
    if (this.parent) {
      this.parent.incrementCount(this.incrementAmount);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.parent = findParent(this, 'incrementCount');
  }
  _render() {
    return super._render((context, html) => html`
      <h3>Child class</h3>
      <p>Click below to increment parent count above by ${this.incrementAmount}</p>
      <button onclick="${this.incrementParent}">Increment</button>
    `);
  }
}

customElements.define(ParentComp.is, ParentComp);
customElements.define(ChildComp.is, ChildComp);
