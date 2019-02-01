# @aofl/store

@aofl/store is a built on the same principles as redux and attempts to simplify some of Redux's concepts. It also incorporates ideas from other centralized state management implementations.

---
## Examples
* https://stackblitz.com/edit/1-0-0-store?embed=1

---
## Installation
```bash
npm i -S @aofl/store
```

---
### Concepts

#### State
In @aofl/store the state consists of a collection of sub-states. This allows us to add new sub-states at runtime which leads to constructing an efficient state object based on the applications current needs.

The state object must not be mutated directly. In fact, when debug mode is enabled, Object.freeze is called on every property of the state, attempting to mutate the state will throw an error. To modify store, mutation and decorator functions must be used.


#### State Definition Object (SDO)
A State Definition Object (SDO) is an object that defines the properties of a sub-state. SDOs must define a namespace, a mutations object, and optionally, a decorators array, and an asyncMutations object.

Here's an example of an SDO configured with all the valid options.
```javascript
const accountsSdo = {
  namespace: 'accounts', // required
  mutations: { // required
    init(payload) {
      return {
        accounts: [],
        selectedAccountId: 0
      };
    }, // required
    setActiveAccount(subState, payload) {}
  },
  decorators: [ // optional
    (nextState) => {}
  ],
  asyncMutations: { // optional
      setActiveUser: {
        condition(nextState) {},
        method(nextState) {}
      }
    }
  };

storeInstance.addState(accountsSdo);
```

##### namespace
sub-states are keyed by namespace. Additionally mutations can only be invoked using the namespace and can only modify the sub-state attached to a namespace.

```javascript
// storeInstance.state
{
  accounts: { // namespace
    accounts: [],
    selectedAccountId: 0
  }
}
```

##### mutations
mutations must include an `init()` method. This function is invoked when SDO is added to store using `addState(SDO, [payload])` and sets the inital state of the sub-state. In addition to initializing the state object, the data returned from `init()` is used to automatically generate setter mutations for all the properties of the sub state.

When a mutation function is invoked; the sub-state pertaining to the mutation's namespace is passed to the mutation function. This means, a mutation function can only modify the sub-state it's attached to.

> Some rules to follow when creating mutation functions...
>
> * mutation functions must be pure functions.
> * mutation functions can only change the value of the namespace they belong to.
> * mutation functions should return a new reference to the sub-state object (Object.assign, @aofl/object-utils/deepAssign)
>

```javascript
const accountsMutations = {
  init() {
    return {
      accounts: [],
      lastLogin: 0,
      selectedAccountId: 0
    };
  },
  insertAccount(subState, account) {
    return Object.assign({}, subState, {
      accounts: [
        ...subState.accounts,
        account
      ]
    });
  }
};
```
*The above example will include the auto generated mutations `setAccounts`, `setLastLogin`, and `setSelectedAccountId`*

##### decorators
Decorators are used to derive new information based on the state of the application. E.g. formatting timestamps to formatted date strings or calculating number of pages based on pagination data (limit per page and total results).

When a mutation is commited to the store. The store applies the mutation to a copy of the state and before the new state object is commited it passes through all decorator functions. Therefore, in one operation we can mutate state and calculate derived values. Whith this model a lot of the applications logic can be moved to decorators and there is no need for individual compononts to encapsulate this logic.

The nameing convension for decorated keys is that they should be prepended with `$` to make it easy to distinguish between state keys and decorated keys.

> Some rules to follow when creating decorators...
>
> * Decorators should only add and update a single key in a sub-state.
> * Decorators can draw information from multiple sub-states to derive new values.
> * Decorators should always have a conditional statement to only allow them to run on the first run or if the sub-state properties they use are changed/mutated.
> * Decorated keys should be prepended with `$` character.
> * Decorator functions should return a new reference of state which points to a new reference of the sub-state it modified (@aofl/object-utils/deepAssign)

```javascript
import deepAssign from '@aofl/object-utils';
import timeFormatter from 'time/formatter/module :)';

const accountsDecorators = [
  (_nextState) => { // nextState is mutatedState and will become the next state of the application
    const state = storeInstance.getState(); // get the current state
    let nextState = _nextState;

    if ( // we should only mutate state on first run or if substate or source values were mutated
      typeof nextState.accounts.$formattedLastLogin === 'undefined' || // first run?
      nextState.accounts.selectedAccountId !== state.accounts.selectedAccountId // selectedAccountId changed?
    ) {
      nextState = deepAssign(_nextState, 'accounts', { // check @aofl/object-utils
        $formattedLastLogin: timeFormatter(nextState.accounts.lastLogin)
      });
    }

    return nextState;
  }
];

```

##### asyncMutations
Documentation is WIP


#### `commit()`
To change state `commit()` can be used. It accepts variadic mutation objects as arguments.

```javascript
storeInstance.commit({
  namespace: 'accounts',
  mutationId: 'setActiveAccount',
  payload: 1234
}, {
  namespace: 'otherNamespace',
  mutationId: ...
  payload: ...
}, ...);
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
