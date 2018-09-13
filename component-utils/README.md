# @aofl/component-utils

A small collection of component utility functions.

---
## Installation

```bash
npm i -S @aofl/component-utils
```

---
## Usage
```javascript
import {findParent} from '@aofl/component-utils';

class AoflListOption extends parentDepMixin(LitElement) {
...
connectedCallback() {
    super.connectedCallback();
    this.renderComplete.then(() => {
      this.listElement = findParent(this, 'addOption'); // register this list option with a parent who supports it
      this.listElement.addOption(this);
    });
  }
...
```

---
## Methods

### findParent
Finds a parent component which matches the method signature provided

#### Arguments
| Name        | Type   | Description    |
|-------------|--------|----------------|
| context     | Object | The child component |
| ...args     | String | Method names that must be found on the parent |
