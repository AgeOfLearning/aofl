# TODO App Tutorial

The purpose of this tutorial is to demonstrate features of the AofL JS framework. In this tutorial we will use the CLI tool, data store, form validation, and as a bonus we'll even implement localization.

## Requirements

A User should be able to ...

1. add new items
1. toggle items complete/incomplete
1. filter items by completed, not completed
1. remove the filter
1. see the count of incomplete items

## Init Project

Let's start by installing the starter app.

```bash
npx aofl init todo-app
cd todo-app
```

## State Definition Object (SDO)

Before building the UI let's implement a SDO to handle all "todo list" operations.

Install dependencies

```bash
npm i -S @aofl/store @aofl/map-state-properties-mixin
```

- @aofl/store is our data store implementation.
- @aofl/map-state-properties-mixin is used connect our components to store. It abstracts subscribing and unsubscribing to/from store based on the component's life cycle.

Update the `constants-enumerate` file and add a new key for sdoNamespaces. We'll call the store namespace for todos todos.

```javascript
// modules/constants-enumerate/index.js
const sdoNamespaces = {
  TODOS: "todos"
};

export { sdoNamespaces };
```

Now create

- routes/home/modules/todos-sdo/index.js
- routes/home/modules/todos-sdo/mutations.js
- routes/home/modules/todos-sdo/decorators.js

```javascript
// routes/home/modules/todos-sdo/index.js
import { sdoNamespaces } from "../../../../modules/constants-enumerate";
import { storeInstance } from "@aofl/store";
import mutations from "./mutations";
import decorators from "./decorators";

const sdo = {
  namespace: sdoNamespaces.TODOS,
  mutations,
  decorators
};

storeInstance.addState(sdo);
```

An SDO defines a sub-state of the application store and consists of a namespace, an object of mutations, and an array of decorators. `namespace` and `mutations` are required and `mutation` objects must contain an `init` function.

```javascript
// routes/home/modules/todos-sdo/mutations.js
const mutations = {
  init(payload) {
    return Object.assign(
      {
        todos: [],
        filter: ""
      },
      payload
    );
  }
};

export default mutations;
```

`init` returns the initial state of the "todos" sub-state and is invoked when `storeInstance.addState(sdo)` is called. `addState` accepts a second argument that will be passed to the `init` function. This is useful if we want to save the state and restore from it the when our application loads. For our Todo App we need an array of "todos" and a "filter" type.

Next we need to add a mutation function to insert new items into our "todos" sub-state.

```javascript
// routes/home/modules/todos-sdo/mutations.js
const mutations = {
  init(payload) {
    ...
  },
  insert(subState, description) {
    return Object.assign({}, subState, {
      todos: [
        ...subState.todos,
        {
          index: subState.todos.length,
          description,
          completed: false
        }
      ]
    });
  }
};

export default mutations;
```

Mutation functions, with the exception of `init`, take `subState` and `payload` as parameters. Here we create a new object from `subState` and insert a new todo object based on payload.

Here's the completed mutations file.

```javascript
// routes/home/modules/todos-sdo/mutations.js
const mutations = {
  init(payload) {
    return Object.assign(
      {
        todos: [],
        filter: ""
      },
      payload
    );
  },
  insert(subState, description) {
    return Object.assign({}, subState, {
      todos: [
        ...subState.todos,
        {
          index: subState.todos.length,
          description,
          completed: false
        }
      ]
    });
  },
  toggleComplete(subState, index) {
    if (index >= subState.todos.length || index < 0) {
      return subState;
    }

    return Object.assign({}, subState, {
      todos: [
        ...subState.todos.slice(0, index),
        {
          ...subState.todos[index],
          completed: !subState.todos[index].completed
        },
        ...subState.todos.slice(index + 1)
      ]
    });
  },
  filterCompleted(subState) {
    return Object.assign({}, subState, {
      filter: "completed"
    });
  },
  filterIncomplete(subState) {
    return Object.assign({}, subState, {
      filter: "incomplete"
    });
  },
  removeFilter(subState) {
    return Object.assign({}, subState, {
      filter: ""
    });
  }
};

export default mutations;
```

We can now set the filter type, add new items and toggle a todo's completed state. While we can set the filter type we still need to filter the "todos" array to meet our requirements. For this we turn to decorators. Decorators are functions that derive new data based on sub-state values and add new keys to store. By conventions these keys are prefixed with a dollar sign (`$`). Decorators are processed once all mutations are applied to the store but before the subscribed functions are invoked. A store update happens in 2 steps, first mutations are applied, then decorators.

```javascript
// routes/home/modules/todos-sdo/decorators.js
import { storeInstance } from "@aofl/store";
import { sdoNamespaces } from "../../../../modules/constants-enumerate";
import { deepAssign } from "@aofl/object-utils";

const decorators = [
  _nextState => {
    const state = storeInstance.getState();
    let nextState = _nextState;

    if (
      typeof nextState[sdoNamespaces.TODOS].$todosCount === "undefined" || // first run?
      nextState[sdoNamespaces.TODOS] !== state[sdoNamespaces.TODOS]
    ) {
      const $todosCount = nextState[sdoNamespaces.TODOS].todos.reduce(
        (acc, todo) => {
          if (todo.completed === false) {
            return acc + 1;
          }
          return acc;
        },
        0
      );

      nextState = deepAssign(nextState, sdoNamespaces.TODOS, {
        $todosCount
      });
    }

    return nextState;
  }
];

export default decorators;
```

First the `nextState` of the store is passed into the decorator function. Then we get the current state from the store. We can compare the values to see if they were changed. Since we create new objects in the mutation function this is a quick comparison. All decorator functions will have a similar conditional to the function above. Does the decorated key exist and is the sub-state different between current and next states. Next we count the number of incomplete todos and update and return `nextState`. Check out the documentation for [deepAssign](https://www.npmjs.com/package/@aofl/object-utils#deepassign).

> Every time the todos sub-state updates our decorators will run and compute their respective values before subscribers are notified. This means decorated values are computed once when needed and can be used throughout the application.

Here's our \$filteredTodoos decorator.

```javascript
// routes/home/modules/todos-sdo/decorators.js
const decorators = [
  ..._nextState => {
    const state = storeInstance.getState();
    let nextState = _nextState;

    if (
      typeof nextState[sdoNamespaces.TODOS].$filteredTodos === "undefined" || // first run?
      nextState[sdoNamespaces.TODOS] !== state[sdoNamespaces.TODOS]
    ) {
      let $filteredTodos = [...nextState[sdoNamespaces.TODOS].todos];

      if (nextState[sdoNamespaces.TODOS].filter === "completed") {
        $filteredTodos = nextState[sdoNamespaces.TODOS].todos.filter(
          todo => todo.completed === false
        );
      } else if (nextState[sdoNamespaces.TODOS].filter === "incomplete") {
        $filteredTodos = nextState[sdoNamespaces.TODOS].todos.filter(
          todo => todo.completed === true
        );
      }

      nextState = deepAssign(nextState, sdoNamespaces.TODOS, {
        $filteredTodos
      });
    }

    return nextState;
  }
];

export default decorators;
```

And we are done with setting up the state of the application and all the logic we need to support our requirements.

## Map State to Component

Once the SDOs for the page are setup we need a way to display this data to the user. We can manually subscribe to store and get notified when store updates happen. However, this will require us to manually unsubscribe from store when the component detaches from DOM. Instead, we have developed [@aofl/map-state-properties-mixin](https://www.npmjs.com/package/@aofl/map-state-properties-mixin) to automate this process.

```javascript
// routes/home/index.js
...
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import './modules/todos-sdo';
import {sdoNamespaces} from '../../modules/constants-enumerate';
...

class HomePage extends mapStatePropertiesMixin(AoflElement) {
  ...
  constructor() {
    super();
    this.storeInstance = storeInstance;
  }
  ...
}
```

Here we import our dependencies as usual. The HomePage class extends from AoflElement mixed with mapStatePropertiesMixn. This new super class expects `storeInstance` to be defined by the child constructor.

Next we implement `mapStateProperties` function.

```javascript
// routes/home/index.js
...
class HomePage extends mapStatePropertiesMixin(AoflElement) {
  ...
  /**
   * @readonly
   */
  static get properties() {
    return {
      todosCount: {type: Number, attribute: false},
      filteredTodos: {type: Array, attribute: false}
    };
  }
  ...
  mapStateProperties() {
    const state = this.storeInstance.getState();

    this.todosCount = state[sdoNamespaces.TODOS].$todosCount;
    this.filteredTodos = state[sdoNamespaces.TODOS].$filteredTodos;
  }
  ...
}
```

@aofl/map-state-properties-mixin automatically subscribes the `mapStateProperties` function to store for us. In `mapStateProperties` we get the state of the application from store and map the decorated properties `$todoCount` and `$filteredTodos` to our component.

In addition to the `mapStateProperties` function we need define a static `properties` property on HomePage to make these properties trigger the render function when their values change.

Now we can update our template and display these values.

```javascript
// routes/home/template.js
export const template = (ctx, html) => html`
  <h1>TODO List - ${ctx.todosCount} Remaining</h1>

  <ul>
    ${
      ctx.filteredTodos.map(
        todo =>
          html`
            <li>${todo.description}</li>
          `
      )
    }
  </ul>
`;
```

## Add Todo Form

```javascript
// routes/home/template.js
export const template = (ctx, html) => html`
  <h1>TODO List - ${ctx.todosCount} Remaining</h1>

  <ul>
    ${
      ctx.filteredTodos.map(
        todo =>
          html`
            <li>${todo.description}</li>
          `
      )
    }
    <li>
      <form @submit="${e => ctx.insertTodo(e)}">
        <input name="description" />
      </form>
    </li>
  </ul>
`;
```

_`@submit` is `lit-html` syntax for adding event listeners._

```javascript
// routes/home/index.js
...
class HomePage extends mapStatePropertiesMixin(AoflElement) {
  ...
  insertTodo(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const description = formData.get('description');

    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'insert',
      payload: description
    });

    form.reset();
  }
  ...
}
```

In `insertTodo(e)` we get the form data and commit the todo description to store.

## Architecture

Before we add more features to the HomePage element let's think about how we want to break our application into smaller modules. We can look at our requirements and decide if which bullet points are generic and which ones are specific to the HomePage component.

> A User should be able to ...
>
> 1. add new items
> 1. toggle items complete/incomplete
> 1. filter items by completed, not completed
> 1. remove the filter
> 1. see the count of incomplete items

Based on this list, I would say showing the list and the count of incomplete items are features of the HomePage and the rest can be generic components. With this plan we can create 'add-todo-form' and 'todo-filters' components and use them any where in the application.

## add-todo-form

In this section we'll create a new component, and setup form validation.

Install dependencies

```bash
npm i -S @aofl/form-validate
```

- @aofl/form-validate gives us form validation capabilities.

Create component

```bash
npx aofl g c routes/home/modules/add-todo-form
```

```javascript
// routes/home/modules/add-todo-form/index.js
...
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {validationMixin, isRequired} from '@aofl/form-validate';
import {storeInstance} from '@aofl/store';
import '../todos-sdo';

/**
 * @summary AddTodoForm
 * @class AddTodoForm
 * @extends {AoflElement}
 */
class AddTodoForm extends validationMixin(AoflElement) {
  /**
   * Creates an instance of AddTodoForm.
   */
  constructor() {
    super();

    this.description = '';
    this.validators = {
      description: {
        isRequired
      }
    };
  }
  ...
  /**
   *
   * @readonly
   */
  static get properties() {
    return {
      description: {type: String}
    };
  }

  /**
   *
   * @param {*} e
   */
  onDescriptionUpdate(e) {
    this.description = e.target.value;
    this.form.description.validate();
  }

  /**
   *
   * @param {*} e
   */
  async insertTodo(e) {
    e.preventDefault();

    this.form.validate();
    await this.form.validateComplete;

    if (this.form.valid) {
      const form = e.target;
      const formData = new FormData(form);
      const description = formData.get('description');

      storeInstance.commit({
        namespace: sdoNamespaces.TODOS,
        mutationId: 'insert',
        payload: description
      });

      this.description = '';
    }
  }
}
...
```

We mix `AddTodoForm` with `validationMixin` and provide a `validators` object in the constructor. We define a view property `description`.

`onDescriptionUpdate(e)` will be used as an input event listener callback on the description field. It will update the value of `description` property and invoke the validation function on the field.

We have modified version of the `insertTodo` function that validates the form before committing to store.

```javascript
// routes/home/modules/add-todo-form/template.js
export default (ctx, html) => html`
  <form @submit="${e => ctx.insertTodo(e)}">
    <input
      name="description"
      @input="${e => ctx.onDescriptionUpdate(e)}"
      .value="${ctx.description}"
    />
    <button type="submit" ?disabled="${!ctx.form.valid}">Add</button> ${
      ctx.form.description.isRequired.valid
        ? ""
        : html`
            <p>Description is required</p>
          `
    }
  </form>
`;
```

The input field binds the `onDescriptionUpdate` function to the input event of the input field. We're also binding the `description` property to the `value` property of the input.

Placing a dot in front of an attribute means we are setting the value on the property of that element and not as an attribute. Consider `element.setAttribute('attr', 'value')` vs `element.attr = 'value'`. Checkout the [definition for value on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-value).

We also added a button to the form and we can use the Boolean attribute disabled to disable the button as well as the form. A boolean attributes value is true as long as that attribute is present on the element. `<elem attr>`, `<elem attr="false">`, `<elem attr="null">` will all evaluate to `elem.atrr === true`. The only time the property corresponding to the attribute will be false is when the boolean attribute is removed from the element. To achieve this lit-html provides the `?attr="${condition}"` syntax.

Finally, we use conditional rendering to display the form validation error message.

Update `routes/home/temeplate.js` and `routes/home/index.js`. Remove the code we added in the previous section and import `add-todo-farm` in the template.js file and use the component in the template.

```javascript
// routes/home/template.js
import "./modules/add-todo-form";

export const template = (ctx, html) => html`
  <h1>TODO List - ${ctx.todosCount} Remaining</h1>

  <ul>
    ${
      ctx.filteredTodos.map(
        todo =>
          html`
            <li>${todo.description}</li>
          `
      )
    }
    <li><add-todo-form></add-todo-form></li>
  </ul>
`;
```

Now we can use the form to add new items to the todo list.

## todo-filters

todo-filters is going to be a component that renders 3 buttons, Show All, Show Remaining, and Show Completed.

Create the component

```bash
npx aofl g c routes/home/modules/todo-filters
```

```javascript
// routes/home/modules/todo-filters/index.js
import styles from "./template.css";
import template from "./template";
import AoflElement from "@aofl/web-components/aofl-element";
import { sdoNamespaces } from "../../../../modules/constants-enumerate";
import "../todos-sdo";
import { storeInstance } from "@aofl/store";

/**
 * @summary TodoFilters
 * @class TodoFilters
 * @extends {AoflElement}
 */
class TodoFilters extends AoflElement {
  /**
   * @readonly
   */
  static get is() {
    return "todo-filters";
  }

  /**
   *
   * @param {*} e
   */
  clearFilter() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: "removeFilter"
    });
  }

  /**
   *
   * @param {*} e
   */
  filterCompleted() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: "filterCompleted"
    });
  }

  /**
   *
   */
  filterIncomplete() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: "filterIncomplete"
    });
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(TodoFilters.is, TodoFilters);

export default TodoFilters;
```

We added 3 click handler functions clearFilter, filterCompleted, filterIncomplete. These functions are pretty minimal and all they do is commit a new filter type to the store.

```javascript
// routes/home/modules/todo-filters/template.js
export default (ctx, html) => html`
  <button @click="${e => ctx.clearFilter(e)}">Show All</button>
  <button @click="${e => ctx.filterCompleted(e)}">Show Remaining</button>
  <button @click="${e => ctx.filterIncomplete(e)}">Show Completed</button>
`;
```

Import todo-filters and use them in HomePage. And let's add a button to toggle the completed state of each todo item.

```javascript
// routes/home/template.js
import "./modules/add-todo-form";
import "./modules/todo-filters";

export const template = (ctx, html) => html`
  <h1>TODO List - ${ctx.todosCount} Remaining</h1>

  <todo-filters></todo-filters>

  <ul>
    ${
      ctx.filteredTodos.map(
        todo => html`
          <li>
            <span class="${todo.completed ? "completed" : ""}"
              >${todo.description}</span
            >
            <button @click="${e => ctx.toggleTodo(e, todo.index)}">
              toggle
            </button>
          </li>
        `
      )
    }
    <li><add-todo-form></add-todo-form></li>
  </ul>
`;
```

```css
/* routes/home/template.css */
:host {
  display: block;
}

.completed {
  color: #f00;
  font-style: italic;
}
```

```javascript
// routes/home/index.js
...
class HomePage extends mapStatePropertiesMixin(AoflElement) {
  ...
  toggleTodo(e, index) {
    e.preventDefault();

    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'toggleComplete',
      payload: index
    });
  }
...
```

## Localization

@aofl/i18-loader and @aofl/i18n-mixin are required to implement localization. The starter app is already configured with the loader so we only need to install the mixin.

```
npm i -S @aofl/i18n-mixin
```

Create an empty routes/home/i18n/index.js file.

In home/index.js import the mixin and the i18n/index.js you just created.

```javascript
...
import {i18nMixin} from '@aofl/i18n-mixin';
import translations from './i18n';

/**
 *
 * @extends {AoflElement}
 */
class HomePage extends i18nMixin(mapStatePropertiesMixin(AoflElement)) {
  ...
  constructor() {
    super();

    this.translations = translations;
    this.storeInstance = storeInstance;
  }
  ...
  render() {
    return super.render({
      default: {
        template,
        styles: [styles]
      }
    });
  }
  ...
```

Mix the `mapStatePropertiesMixin(AoflElement)` class with i18nMixin mixin and assign the translations object to the instance in the constructor.

Update the render function return an pass an object to `super.render()`. The i18nMixin lets us specify multiple templates based on locale.

E.g.

```javascript
  ...
  render() {
    return super.render({
      default: {
        template,
        styles: [styles]
      },
      'es-US': {
        esUsTemplate,
        styles: [esUsStyles]
      }
    });
  }
  ...

```

Now we can use the `__` and `_r` functions in the template.

```javascript
// routes/home/template.js
import "./modules/add-todo-form";
import "./modules/todo-filters";
import { until } from "lit-html/directives/until";

export const template = (ctx, html) => html`
  <h1>
    ${until(ctx._r(ctx.__("TODO List - %r1% Remaining"), ctx.todosCount))}
  </h1>

  <todo-filters></todo-filters>

  <ul>
    ${
      ctx.filteredTodos.map(
        todo => html`
          <li>
            <span class="${todo.completed ? "completed" : ""}"
              >${todo.description}</span
            >
            <button @click="${e => ctx.toggleTodo(e, todo.index)}">
              ${until(ctx.__("toggle"))}
            </button>
          </li>
        `
      )
    }
    <li><add-todo-form></add-todo-form></li>
  </ul>
`;
```

Apply the these changes to todo-filters and add-todo-form components.

```javascript
// routes/home/modules/todo-filters/template.js
import { until } from "lit-html/directives/until";

export default (ctx, html) => html`
  <button @click="${e => ctx.clearFilter(e)}">
    ${until(ctx.__("Show All"))}
  </button>
  <button @click="${e => ctx.filterCompleted(e)}">
    ${until(ctx.__("Show Remaining"))}
  </button>
  <button @click="${e => ctx.filterIncomplete(e)}">
    ${until(ctx.__("Show Completed"))}
  </button>
`;
```

```javascript
// routes/home/modules/add-todo-form/template.js
import { until } from "lit-html/directives/until";

export default (ctx, html) => html`
  <form @submit="${e => ctx.insertTodo(e)}">
    <input
      name="description"
      @input="${e => ctx.onDescriptionUpdate(e)}"
      .value="${ctx.description}"
    />
    <button type="submit" ?disabled="${!ctx.form.valid}">
      ${until(ctx.__("Add"))}
    </button>
    ${
      ctx.form.description.isRequired.valid
        ? ""
        : html`
            <p>${until(ctx.__("Description is required"))}</p>
          `
    }
  </form>
`;
```

When ready run the @aofl/cli i18n command.

```bash
npm run i18n
```

This will generate an 18n-manifest.json in the root of the project but also a translations.json in routes/home/i18n. The i18n script also generates unique IDs in form of tt-tags for each translatable string.

To extend support for other locales you can place a translated version of the translations.json in i18n directory and append `_[language-ContryCode]` to the file name. E.g. `translations_es-US.json`.

```json
// routes/home/i18n/translations_es-US.json
{
  "<tt-AIDbLH2T>": {
    "text": "Lista de tareas - %%r1::context.todosCount%% Restante(s)"
  },
  "<tt-+/5tT+3O>": {
    "text": "cambiar"
  },
  "<tt-PjQ0Kc9o>": {
    "text": "Añadir"
  },
  "<tt-vyVch23O>": {
    "text": "Se requiere descripción"
  },
  "<tt-JDZGQvt1>": {
    "text": "Mostrar todo"
  },
  "<tt-28iSbtD7>": {
    "text": "Mostrar Restantes"
  },
  "<tt-6iHcsOp3>": {
    "text": "Mostrar Completados"
  }
}
```

If you copy the content of the translations_es-US.json from here make sure the tt-tags match those of your project.

Run the server again to see the changes...

```
npm run start:dev
```

The language of the page is controlled by the lang attribute on the html element. Let's place a button on the page to toggle language.

```javascript
// routes/home/template.js
import "./modules/add-todo-form";
import "./modules/todo-filters";
import { until } from "lit-html/directives/until";

export const template = (ctx, html) => html`
  <h1>
    ${until(ctx._r(ctx.__("TODO List - %r1% Remaining"), ctx.todosCount))}
    <button @click="${() => ctx.toggleLang()}">En/Es</button>
  </h1>

  <todo-filters></todo-filters>

  <ul>
    ${
      ctx.filteredTodos.map(
        todo => html`
          <li>
            <span class="${todo.completed ? "completed" : ""}"
              >${todo.description}</span
            >
            <button @click="${e => ctx.toggleTodo(e, todo.index)}">
              ${until(ctx.__("toggle"))}
            </button>
          </li>
        `
      )
    }
    <li><add-todo-form></add-todo-form></li>
  </ul>
`;
```

```javascript
...
class HomePage extends i18nMixin(mapStatePropertiesMixin(AoflElement)) {
  ...
  /**
   *
   */
  toggleLang() {
    const lang = document.documentElement.getAttribute('lang');
    if (lang === 'en-US') {
      document.documentElement.setAttribute('lang', 'es-US');
    } else {
      document.documentElement.setAttribute('lang', 'en-US');
    }
  }
  ...
```

Congratulations :)

Let's recap what we achieved here. We started a AofL JS project from scratch, setup a SDO based on requirements, and created a few components. It is important to note that even for this simple example we started with a modular architecture that allowed us to easily build on top of. We have separated presentation and business logic and our components are merely proxies between different APIs. Inputs and buttons allow our components to get data from the user the same way our components can make calls to web-services to retrieve information. In this uni-directional flow of data we always commit the raw data, regardless of its source, to the data store and use decorators to process the raw data for the presentation layer. The decorated data is then mapped to the components' template.
