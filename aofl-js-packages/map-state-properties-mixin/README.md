# @aofl/map-state-properties-mixin

`@aofl/map-state-properties-mixin` can be used to automatically subscribe `mapStateProperties()` to storeInstance and unsubscribe when the component is detached from dom. It eliminates the need to replicate the same block of code for every component that needs to react to changes from store.

The class extending `mapStatePropertiesMixin(AoflElement)` is required to have `storeInstance` as an instance property and implement `mapStateProperties()` function.

## Examples
* [Basic](https://stackblitz.com/edit/1-0-0-map-state-properties-mixin?embed=1)

## Installation
```bash
$ npm i -S @aofl/map-state-properties-mixin
```
## Usage
```javascript
import styles from './styles.css';
const NAMESPACE = 'example-namespace';

class MyComponent extends mapStatePropertiesMixin(AoflElement) {
  constructor() {
    super();
    this.storeInstance = storeInstance;
  }

  static get properties() {
    return {
      name: String
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.mapStateProperties(); // initialize properties based on values in store
  }

  mapStateProperties() { // map properties from store to view
    const state = this.storeInstance.getState();
    this.name = state[NAMESPACE].name;
  }

  _render(context, html) {
    return super._render(html`<h1>Hello ${context.name}</h1>`, [styles])
  }
}

```
