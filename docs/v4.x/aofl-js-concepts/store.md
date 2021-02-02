# Data Store

@aofl/store is a state management implementation for Aofl JS applications. It is influenced by the same principles as redux while simplifying some of redux's concepts. All Aofl JS applications have an underlying state that is the source of truth that drives the app. Changes made to this state are done with pure functions(most of the time) and data flows unidirectionally.

## How it works

Every application will contain the following pieces:
- **State**: The backbone of the app
- **View**: A visualization of the underlying state
- **Mutations**: The ways the state may be modified

Based on these pieces when working with @aofl/store every developer should constantly be asking themselves what their applications state should look like. How should this be mapped to the view? What mutations are necessary to modify the state? Let's install the store and jump into some of the core concepts that make up @aofl/store.

---
## Installation

**NPM**
```bash
npm i -S @aofl/store
```

## State

Like other centralized state implementations the state is the single source of truth in our application.

In @aofl/store the state is made up of a collection of sub-states partitioned into a number of namespaces. This allows us to add new sub-states at runtime which leads to constructing an efficient state object based on the applications current needs.

The state object must not be mutated directly. In fact, when debug mode is enabled, Object.freeze is called on every property of the state, attempting to mutate the state will throw an error. To modify store, mutation and decorator functions must be used.

Here is an example of a simple application state and its substates:
```javascript
{
  form: {
    username: 'Bob',
    email: 'bob@gmail.com'
    day: 'Mon',
    month: '',
    year: ''
  },
  dropdowns: {
    dayPicker: true,
    monthPicker: false,
    yearPicker: false
  }
}
```

This state is modeling an application with a single page containing a form. It is split into 2 substates 'form' and 'dropdowns'. We can see based on the current state that the user has entered their username, email, and selected 'Mon' from the dayPicker dropdown but still has to select a month and year. Note that the dropdowns are created as their own namespace rather than being listed as a key in the form namespace. This is design decision and can vary between different applications.


#### State Definition Object (SDO)
A State Definition Object (SDO) is an object that defines the properties of a sub-state. SDOs must define a namespace, a mutations object, and optionally, a decorators array.

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
  ]
};

store.addState(accountsSdo);
```

This is how you will build your applications state. Define the sdo and then call addState passing it as an argument.


#### Namespaces
sub-states are keyed by namespaces. Additionally mutations can only be invoked using the namespace and can only modify the sub-state attached to a namespace.

```javascript
// store.getState()
{
  accounts: { // namespace
    accounts: [],
    selectedAccountId: 0
  }
}
```

## Mutations

Our application state would be useless if we couldn't make any changes to it. Thankfully we can define any number of mutations to make any number of changes. Let's look at a sample mutation object:

```javascript
const accountsMutations = {
  init() {
    return {
      accounts: [],
      lastLogin: 0,
      selectedAccountId: 0
    };
  },
  setActiveAccount(subState, {selectedAccountId}) {
    return Object.assign({}, subState, {
      selectedAccountId
    });
  }
};
```

Here we have mutation for setting active accounts and an init method. Mutations must include an `init()` method. This function is invoked when SDO is added to store using `addState(SDO, [payload])` and sets the inital state of the sub-state.

When a mutation function is invoked; the sub-state pertaining to the mutation's namespace is passed to the mutation function. This means, a mutation function can only modify the sub-state it's attached to.

Also note that setActiveAccount is a pure function. It does not directly modify the state but instead utilizes Object.assign to create a fresh iteration of the state.

After initialization this will be the value of `store.getState()` (Assuming no other namespace)
```javascript
{
  accounts: [],
  lastLogin: 0,
  selectedAccountId: 0
}
```

To trigger this mutation we simply make a store commit with the namespace (we'll assume it's 'accountsPage'), mutation name, and payload.
```javascript
store.commit({
  namespace: 'accountsPage',
  mutationId: 'setActiveaccount',
  payload: {
    selectedAccountId: 15
  }
});
```

After committing this will be our updated `store.getState()`:
```javascript
{
  accounts: [],
  lastLogin: 0,
  selectedAccountId: 15
}
```

That's all there is to it! Define your mutations and start committing.
<br>

> Some rules to follow when creating mutation functions...
>
> * mutation functions must be pure functions.
> * mutation functions can only change the value of the namespace they belong to.
> * mutation functions should return a new reference to the sub-state object (Object.assign, @aofl/object-utils/deepAssign)
>

## Decorators

Sometimes we want to manipulate or modify the data we send to the store. It feels bad putting the logic to do this in the components since the logic is related to the state. Decorators remove the logic from the components and places it next to the mutations.

Decorators are used to derive new information based on the state of the application. E.g. Converting timestamps to formatted date strings or calculating number of pages based on pagination data (limit per page and total results).

Before a new state object (post mutation commit) it passes through all the decorator functions. Nothing extra needs to be done to run your commits through the decorators, it happens automatically. Therefore in one operation we can mutate state and calculate derived values. With this model logic once encapsulated in components is moved to decorators.

The naming convention for decorated keys is that they should be prepended with `$` to make it easy to distinguish between state keys and decorated keys.

Here is an example inside of decorators.js file
```javascript
import deepAssign from '@aofl/object-utils';

const accountsDecorators = [
  (_nextState) => { // nextState is mutatedState and will become the next state of the application
    const state = storeInstance.getState(); // get the current state
    let nextState = _nextState;

    if ( // we should only mutate state on first run or if substate or source values were mutated
      typeof nextState.accounts.$allCapsFirstName === 'undefined' || // first run?
      nextState.accounts.firstName !== state.accounts.firstName // firstName changed?
    ) {
      nextState = deepAssign(_nextState, 'accounts', { // check @aofl/object-utils
        $allCapsFirstName: nextState.accounts.firstName.toUppercase()
      });
    }

    return nextState;
  }
];
```
The `nextState.accounts.firstName !== state.accounts.firstName` clause is what determines if the decorator will make it's modifications.
Before calling the corresponding mutation we may have a `store.getState()` that looks like this:
```javascript
{
  accounts: {
    firstName: ''
  }
}
```

Then we make our commit:
```javascript
store.commit({
  namespace: 'accounts',
  mutationId: 'setFirstName',
  payload: 'sue'
})
```

And now our `store.getState()` will look like this:
```javascript
{
  accounts: {
    firstName: 'sue',
    $allCapsFirstName: 'SUE'
  }
}
```

> Some rules to follow when creating decorators...
>
> * Decorators should only add and update a single key in a sub-state.
> * Decorators can draw information from multiple sub-states to derive new values.
> * Decorators should always have a conditional statement to only allow them to run on the first run or if the sub-state properties they use are changed/mutated.
> * Decorated keys should be prepended with `$` character.
> * Decorator functions should return a new reference of state which points to a new reference of the sub-state it modified (@aofl/object-utils/deepAssign)

## Interacting with the Store

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
To receive updates from the store you first must subscribe. The subscribe function returns the unsubscribe function.

```javascript
const unsubscribe = store.subscribe(() => {
  const state = store.getState();
  view.lastLoginDate = state.accounts.$formattedLastLogin;
});

view.onDestroy(() => {
  unsubscribe();
});
```
