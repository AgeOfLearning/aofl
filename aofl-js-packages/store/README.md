# @aofl/store

@aofl/store is a built on the same principles as redux and attempts to simplify some of Redux's concepts. It also incorporates ideas from other centralized state management implementations.

[Api Documentation](https://ageoflearning.github.io/aofl/v3.x/api-docs/module-@aofl_store.html)

---
## Examples
* https://codesandbox.io/s/github/AgeOfLearning/aofl/tree/v3.0.0/aofl-js-packages/store/examples/

---
## Installation
```bash
npm i -S @aofl/store
```

---
### Concepts

#### State
In @aofl/store the state consists of a collection of sub-states. This allows us to add new sub-states at runtime which leads to constructing an efficient state object based on the applications current needs.

The state object must not be mutated directly. In fact, when debug mode is enabled, Object.freeze is called on every property of the state, attempting to mutate the state will throw an error.


#### State Definition Object (SDO)
A State Definition Object (SDO) is an object that defines the properties of a sub-state. SDOs must define a namespace, state properties and initial values, optionally mutation functions and decorators.

Here's an example of an SDO configured with all the valid options.
```javascript
import {Sdo, decorate, state, storeInstance} from '@aofl/store';

class AccountsSdo extends Sdo {
  static namespace: 'accounts';

  @state() id = 0;
  @state() username = '';
  @state() firstName = '';
  @state() lastName = '';
  @state() email = '';
  @state() phone = 0;
  @state() createdTimestamp = 0;
  @state() products = [];

  addProduct(product) {
    this.products = [
      ...this.products,
      product
    ];
  }

  @decorate('accounts.createdTimestamp')
  get formattedCreated() {
    return new Date(this.date).toLocaleDateString('en-US');
  }
}

const accountsSdo = new AccountsSdo();
storeInstance.addState(accountsSdo);

export {accountsSdo};
```

##### namespace
sub-states are keyed by namespace. Additionally mutations can only be invoked using the namespace and can only modify the sub-state attached to a namespace. The `Sdo` class abstracts away interacting with the store directly.

```javascript
// storeInstance.state
{
  accounts: { // namespace
    id: 0,
    username: '',
    ...
  }
}
```

##### @state
Properties decorated with `@state` are added to Store. Furthermore, the initialized values are used to reset store if necessary. These properties are created with specialized getter/setter functions. The getter proxies the values from `store.state.{namespace}.property`. This means directly committing a change to store will reflect in the sdo instance. The setter function commits the new value to store.

In addition to the state variables, additional methods can be implemented to apply more complex mutations. E.g. inserting into an array or updating nested properties of an object.


##### @decorate
Decorators are used to derive new information based on the state of the application. E.g. formatting timestamps to formatted date strings or calculating number of pages based on pagination data (limit per page and total results).

`@decorate()` takes variadic arguments that map to properties in store. Hence, the paths used include namespace. This allows us to observe changes across multiple SDOs. Consider the case where the decorated value should update when user's preferred locale changes. A decorator can observe changes in UserSettingsSdo and update timestamps accordingly in other SDOs.

Decorated properties are [memoized](https://en.wikipedia.org/wiki/Memoization) based on the arguments passed to @decorate. I.e. the values are computed when accessed and only recomputed when observed values change.


```javascript
import {userSettingsSdo} from 'user-settings-sdo';

class AccountsSdo extends Sdo {
  static namespace: 'accounts';
  ...
  @state() createdTimestamp = 0;
  ...

  @decorate('accounts.createdTimestamp', `${userSettingsSdo.namespace}.locale`)
  get formattedCreated() {
    return new Date(this.date).toLocaleDateString(userSettingsSdo.locale);
  }
}
```


#### `addState()`
Adds a new Sdo to store.

#### `commit()`
To change state `commit()` can be used. It accepts a namespace and a mutation objects as arguments.

```javascript
storeInstance.commit('accounts', {
  id: 1
});
```

#### `subscribe()`
You can subscribe to store to receive updates. The subscribe function returns the unsubscribe function.

```javascript
const unsubscribe = storeInstance.subscribe(() => {
  const state = store.getState();
  view.lastLoginDate = state.accounts.$formattedLastLogin;
});

view.onDestroy(() => {
  unsubscribe();
});
```

#### `flushState()`
Resets the state to the initial state of Sdos.

```javascript
storeInstance.flushState();
```

## Usage with @aofl/element

`@property` decorator exported from @aofl/element extends the @property decorator from lit-element and adds 2 new keys to the options `mapState` and `store`.

`mapState` is a string path relative to the provided store's state property.
`store` defaults to storeInstance exported from @aofl/store. It can be replaced with an instance of store or an sdo class.

```javascript
import {AoflElement, property, customElement} from '@aofl/element';
import template from './template';
import styles from './styles';
import {previewSdo} from '../preview-sdo';

@customElement('example-component)
class ExampleComponent extends AoflElement {
  constructor() {
    super();
  }

  static is = 'example-component';

  @property({mapState: 'count', store: previewSdo})
  count = 0;

  @property({mapState: 'formattedDate', store: previewSdo})
  formattedDate = '';

  incrementCount() {
    previewSdo.increment();
  }

  render() {
    return super.render(template, [styles]);
  }
}

```


