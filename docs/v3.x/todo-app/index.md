# TODO App Tutorial

The purpose of this tutorial is to demonstrate features of AofL JS framework. In this tutorial we will use the CLI tool, data store, form validation, and as a bonus we'll even implement localization.

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
npx @aofl/cli init todo-app
cd todo-app
```

## State Definition Object (SDO)

Before building the UI let's implement a SDO to handle all "todo list" operations.

Install dependencies

```bash
npm i -S @aofl/store @aofl/object-utils
```

- @aofl/store is our data store implementation.


Now create the todos SDO. The following code block is the minimum required configuration for an SDO.

```javascript
// src/modules/todos-sdo.js
import {Sdo, state} from '@aofl/store';

class TodosSdo extends Sdo {
  static namespace = 'todos';

  @state()
  todos = [];

  @state()
  filter = '';
};
```

An SDO defines a sub-state of the data store and consists of a namespace, state properties (with initial state),
mutations and decorators. More on these later.

`@state` decorator creates state properties with special getter/setters. When the value is read it is
proxied from store and when the value is set it commits to store. Checkout [`@aofl/store`](https://github.com/AgeOfLearning/aofl/tree/v3.0.0/aofl-js-packages/store) for documentation.

## State Mutations
Next we need to add two mutation functions insert and toggleComplete.

```javascript
// src/modules/todos-sdo.js
import {Sdo, state} from '@aofl/store';

class TodosSdo extends Sdo {
  static namespace = 'todos';
  ...

  insert(description) {
    this.todos = [
      ...this.todos,
      {
        index: this.todos.length,
        description,
        completed: false
      }
    ];
  }

  toggleComplete(index) {
    if (index >= this.todos.length || index < 0) return;

    this.todos = [
      ...this.todos.slice(0, index),
      {
        ...this.todos[index],
        completed: !this.todos[index].completed
      },
      ...this.todos.slice(index + 1)
    ];
  }
};
```

It's important to break reference to the state properties that are being updated. In fact, in development
mode Object.freeze is called on store.state properties and mutating the properties directly will
result in an error being thrown.

## State Decorators

State decorators are special getters defined on a SDO instance. They are decorated with `@decorate`
and are used to "decorate" state variables. For example, formatting dates or filtering lists.

`@decorate()` takes variadic arguments that map to properties in store. Hence, the paths used include
namespace. This allows us to observe changes across multiple SDOs. Consider the case where the decorated
value should update when user's preferred language changes. A decorator can observe changes in
`UserSettingsSdo` and update labels accordingly in other SDOs.

Decorated properties are [memoized](https://en.wikipedia.org/wiki/Memoization) based on the arguments
passed to `@decorate`. I.e. the values are computed when accessed and only update when observed
values change.

```javascript
// src/modules/todos-sdo.js
import {Sdo, state, decorate, storeInstance} from '@aofl/store';

class TodosSdo extends Sdo {
  static namespace = 'todos';
  ...

  insert(description) {
    ...
  }

  toggleComplete(index) {
    ...
  }

  @decorate('todos.todos')
  get todosCount() {
    return this.todos.reduce((acc, item) => {
      if (item.completed === false) {
        acc += 1;
      }
      return acc;
    }, 0);
  }

  @decorate('todos.todos', 'todos.filter')
  get filteredTodos() {
    const filtered = [...this.todos];

    if (this.filter === 'completed') {
      return filtered.filter((todo) => todo.completed === false);
    } else if (this.filter === 'incomplete') {
      return filtered.filter((todo) => todo.completed === true);
    }

    return filtered;
  }
};

const todosSdo = new TodosSdo();
storeInstance.addState(todosSdo);

export {
  todosSdo
};
```

## Map State to Component

Once the SDOs for the page are setup we need a way to display this data to the user. We can manually subscribe to store and get notified when store updates happen. However, this will require us to manually unsubscribe from store when the component detaches from DOM. Instead, you can use `@property` decoratof form `@aofl/element`

As an alternative you can use [@aofl/map-state-properties-mixin](https://www.npmjs.com/package/@aofl/map-state-properties-mixin).

```javascript
// routes/home/index.js
...
import {AoflElement, customElement, property} from '@aofl/element';
import {todosSdo} from '../../modules/todos-sdo';
...
class HomePage extends AoflElement {
  ...
  @property({type: Number, attribute: false, mapState: `todosCount`, store: todosSdo})
  todosCount = 0;

  @property({type: Array, attribute: false, mapState: `filteredTodos`, store: todosSdo})
  filteredTodos = [];
  ...
}
```

`todosCount` and `filteredTodos` will subscribe to store when the component connects to DOM and unsubscribe
when disconnected. Moreover, when state updates the values will update based on the values in state. And since mutations update the reference of properties, LitElement will rerender our component.

Now we can update our template and display these values.

```javascript
// routes/home/template.js
export const template = (ctx, html) => html`
  <h1>TODO List - ${ctx.todosCount} Remaining</h1>

  <ul>
    ${ctx.filteredTodos.map((todo) => html`<li>${todo.description}</li>`)}
  </ul>
`;
```

## Add Todo Form

```javascript
// routes/home/template.js
import {repeat} from 'lit-html/directives/repeat';

export const template = (ctx, html) => html`
  <h1>TODO List - ${ctx.todosCount} Remaining</h1>

  <ul>
    ${repeat(ctx.filteredTodos, (todo) => todo.index, (todo) => html`<li>${todo.description}</li>`)}
    <li>
      <form @submit="${ctx.insertTodo}">
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
class HomePage extends AoflElement {
  ...
  /**
   *
   * @param {Event} e
   */
  insertTodo(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const description = formData.get('description');

    todosSdo.insert(description);
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
npx aofl g c src/modules/add-todo-form
```

```javascript
// src/modules/add-todo-form/index.js
...
import {AoflElement, customElement} from '@aofl/element';
import {isRequired, validationMixin} from '@aofl/form-validate';
import {todosSdo} from '../todos-sdo';

/**
 * @summary AddTodoForm
 * @extends {validationMixin(AoflElement)}
 */
class AddTodoForm extends validationMixin(AoflElement) {
  /**
   * Creates an instance of AddTodoForm.
   */
  constructor() {
    super();

    this.validators = {
      description: {
        isRequired
      }
    };
  }

  static is = 'add-todo-form';
  description = '';

  descriptionChange(e) {
    this.description = e.target.value;
    this.form.description.validate();
  }

  async insertTodo(e) {
    e.preventDefault();

    this.form.validate();
    await this.form.validateComplete;

    if (this.form.valid) {
      const form = e.target;
      const formData = new FormData(form);

      todosSdo.insert(formData.get('description'));

      this.description = '';
      this.form.reset();
      form.reset();
    }
  }
  ...
}
...
```

We mix `AddTodoForm` with `validationMixin` and provide a `validators` object in the constructor. We define a view property `description`.

`descriptionChange(e)` will be used as an input event listener callback on the description field. It will update the value of `description` property and invoke the validation function on the field.

We have modified version of the `insertTodo` function that validates the form before committing to store.

```javascript
// src/modules/add-todo-form/template.js
export default (ctx, html) => html`
  <form @submit="${ctx.insertTodo}">
    <input name="description" @input="${ctx.descriptionChange}" .value="${ctx.description}">
    <button type="submit" ?disabled="${!ctx.form.valid}">Add</button>
    ${!ctx.form.description.isRequired.valid? html`<p>Description is required</p>`: ''}
  </form>
`;
```

The input field binds the `descriptionChange` function to the input event of the input field. We're also binding the `description` property to the `value` property of the input.

Placing a dot in front of an attribute means we are setting the value on the property of that element and not as an attribute. Consider `element.setAttribute('attr', 'value')` vs `element.attr = 'value'`. Checkout the [documentation page for value on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-value).

We also added a button to the form and we can use the Boolean attribute disabled to disable the button as well as the form. A boolean attributes value is true as long as that attribute is present on the element. `<elem attr>`, `<elem attr="false">`, `<elem attr="null">` will all evaluate to `elem.atrr === true`. The only time the property corresponding to the attribute will be false is when the boolean attribute is removed from the element. To achieve this lit-html provides the `?attr="${condition}"` syntax.

Finally, we use conditional rendering to display the form validation error message.

Update `routes/home/temeplate.js` and `routes/home/index.js`. Remove the code we added in the previous section and import `add-todo-form` in the template.js file and use the component in the template.

```javascript
// routes/home/template.js
import '../../modules/add-todo-form';

export const template = (ctx, html) => html`
  <h1>TODO List - ${ctx.todosCount} Remaining</h1>

  <ul>
    ${repeat(ctx.filteredTodos, (todo) => todo.index, (todo) => html`<li>${todo.description}</li>`)}
    <li><add-todo-form></add-todo-form></li>
  </ul>
`;
```

Now we can use the form to add new items to the todo list.

## todo-filters

todo-filters is going to be a component that renders 3 buttons, Show All, Show Remaining, and Show Completed.

Before we create the component let's add the possible filter values to `src/modules/constants-enumerate.js`.

```javascript
// src/modules/constants-enumerate.js
const todosFilters = {
  NONE: '',
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete'
};

export {
  todosFilters
};
```

Now let's resume creating todos-filters.

```bash
npx aofl g c src/modules/todo-filters
```

```javascript
// src/modules/todo-filters/index.js
...
import {todosSdo} from '../todos-sdo';
import {todosFilters} from '../constants-enumerate';

/**
 * @summary TodoFilters
 * @extends {AoflElement}
 */
class TodoFilters extends AoflElement {
  ...
  /**
   *
   * @param {Event} e
   */
  clearFilter() {
    todosSdo.filter = todosFilters.NONE;
  }

  filterCompleted() {
    todosSdo.filter = todosFilters.COMPLETED;
  }

  filterIncomplete() {
    todosSdo.filter = todosFilters.INCOMPLETE;
  }
  ...
}
...
```

We added 3 click handler functions clearFilter, filterCompleted, filterIncomplete. These functions are pretty minimal and all they do is commit a new filter type to the store.

```javascript
// src/modules/todo-filters/template.js
export default (ctx, html) => html`
  <button @click="${ctx.clearFilter}">Show All</button>
  <button @click="${ctx.filterCompleted}">Show Remaining</button>
  <button @click="${ctx.filterIncomplete}">Show Completed</button>
`;
```

Import todo-filters and use them in HomePage. And let's add a button to toggle the completed state of each todo item.

```javascript
// routes/home/template.js
import '../..//modules/add-todo-form';
import '../../modules/todo-filters';

export const template = (ctx, html) => html`
  <h1>TODO List - ${ctx.todosCount} Remaining</h1>
  <todo-filters></todo-filters>

  <ul>
    ${repeat(ctx.filteredTodos, (todo) => todo.index, (todo) => html`
      <li>
        <span class="${todo.completed ? 'completed' : ''}">${todo.description}</span>
        <button @click="${ctx.toggleTodo}" data-index="${todo.index)}>toggle</button>
      </li>`
    )}
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
  color: #31c131;
  font-style: italic;
  text-decoration: line-through;
}
```

```javascript
// routes/home/index.js
...
class HomePage extends AoflElement {
  ...
    toggleTodo(e) {
    const index = parseInt(e.target.dataset.index, 10);

    todosSdo.toggleComplete(index);
  }
  ...
```

## Localization

@aofl/i18n-mixin are required to implement localization. The starter app is already configured with the loader so we only need to install the mixin.

```
npm i -S @aofl/i18n-mixin @aofl/i18n-auto-id-loader
```

Update `.aofl.js` to use `@aofl/i18n-auto-id-loader`. This loader will automatically generate unique IDs and update the source code for translation strings.

```javascript
const path = require('path');

module.exports = {
  name: 'Aofl Starter',
  build: {
    eslint: {
      options: {
        config: path.join(__dirname, '.eslintrc.js')
      }
    },
    extend() {
      const config = {
        module: {
          rules: [
            {
              test: /\.js$/,
              include: [path.join(__dirname, 'src')],
              use: [
                {
                  loader: '@aofl/i18n-auto-id-loader',
                  options: {
                    cache: true
                  }
                }
              ],
              enforce: 'pre'
            }
          ]
        }
      };

      return config;
    }
  }
};
```
After you update .aofl.js you'll need restart build.

Create an empty `src/i18n/index.js` file.

In home/index.js import the mixin and the i18n/index.js you just created.

```javascript
...
import {i18nMixin} from '@aofl/i18n-mixin';
import translations from '../../i18n';

/**
 *
 * @extends {i18nMixin(AoflElement)}
 */
class HomePage extends i18nMixin(AoflElement) {
  /**
   *
   * Creates an instance of HomePage.
   */
  constructor() {
    super();

    this.translations = translations;
  }
  ...
  /**
   *
   * @return {Object}
   */
  render() {
    return super.render({
      default: {template, styles: [styles]}
    });
  }
}
```

Mix `AoflElement` class with i18nMixin mixin and assign the translations object to the instance in the constructor.

Update the render function return an pass an object to `super.render()`. The i18nMixin lets us specify multiple templates based on locale.

E.g.

```javascript
  ...
  render() {
    return super.render({
      default: {template, styles: [styles]},
      'es-US': {esUsTemplate, styles: [esUsStyles]}
    });
  }
  ...

```

Now we can use the `__` and `_r` functions in the template. ([Docs](https://github.com/AgeOfLearning/aofl/tree/v3.0.0/aofl-js-packages/i18n))

```javascript
// routes/home/template.js
import '../../modules/add-todo-form';
import '../../modules/todos-filters';
import {repeat} from 'lit-html/directives/repeat';
import {until} from 'lit-html/directives/until';

export default (ctx, html) => html`
<h1>
  ${until(ctx._r(ctx.__('TODO List - %r1% Remaining'), ctx.todosCount))}
</h1>


<todos-filters></todos-filters>

<ul>
  ${repeat(ctx.filteredTodos, (todo) => todo.index, (todo) => html`
  <li>
    <span class="${todo.completed? 'completed': ''}">${todo.description}</span>
    <button data-index="${todo.index}" @click="${ctx.toggleTodo}">${until(ctx.__('Toggle'))}</button>
  </li>
  `)}
  <li><add-todo-form></add-todo-form></li>
</ul>
`;

```

Apply the these changes to todo-filters and add-todo-form components. (You'll need to import @aofl/i18n-mixin and src/i18 in index.js, set translation property in the constructor and update the render function.)

```javascript
// src/modules/todo-filters/template.js
import {until} from 'lit-html/directives/until';

export default (ctx, html) => html`
  <button @click="${ctx.clearFilter}">${until(ctx.__('Show All'))}</button>
  <button @click="${ctx.filterCompleted}">${until(ctx.__('Show Remaining'))}</button>
  <button @click="${ctx.filterIncomplete}">${until(ctx.__('Show Completed'))}</button>
`;
```

```javascript
// src/modules/add-todo-form/template.js
import {until} from 'lit-html/directives/until';

export default (ctx, html) => html`
  <form @submit="${ctx.insertTodo}">
    <input name="description" @input="${(ctx.descriptionChange)}" .value="${ctx.description}">
    <button type="submit" ?disabled="${!ctx.form.valid}">${until(ctx.__('Add'))}</button>
    ${ctx.form.description.isRequired.valid? '': html`
      <p>${until(ctx.__('Description is required'))}</p>
    `}
  </form>
`;

```

When ready run the @aofl/cli i18n command.

```bash
npm run i18n
```

This will generate an 18n-manifest.json in the root of the project but also a translations.json in routes/home/i18n. The i18n script also generates unique IDs in form of tt-tags for each translatable string (only when IDs are missing). It will also show if duplicate IDs are found.

To extend support for other locales you can place a translated version of the translations.json in i18n directory and append `_[language-ContryCode]` to the file name. E.g. `translations_es-US.json`.

```json
// src/i18n/translations_es-US.json
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
import '../../modules/add-todo-form';
import '../../modules/todos-filters';
import {repeat} from 'lit-html/directives/repeat';
import {until} from 'lit-html/directives/until';

export default (ctx, html) => html`
<h1>
  ${until(ctx._r(ctx.__('<tt-FFUDNSO0>', 'TODO List - %r1% Remaining'), ctx.todosCount))}
  <button @click="${ctx.toggleLang}">En/Es</button>
</h1>


<todos-filters></todos-filters>

<ul>
  ${repeat(ctx.filteredTodos, (todo) => todo.index, (todo) => html`
  <li>
    <span class="${todo.completed? 'completed': ''}">${todo.description}</span>
    <button data-index="${todo.index}" @click="${ctx.toggleTodo}">${until(ctx.__('<tt-0nLxZuTE>', 'Toggle'))}</button>
  </li>
  `)}
  <li><add-todo-form></add-todo-form></li>
</ul>
`;
```

```javascript
...
class HomePage extends i18nMixin(AoflElement) {
  ...
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
