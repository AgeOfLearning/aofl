# AoflElement

`aofl-element` is a simple extension of `lit-element` that overrides the `_render()` function. It accepts a template function and an String[] of styles. It is intented to be used in place of `lit-element` as the base class for elements. In it's current version it's main purpose is to provide a clean interface to seperate HTML, CSS and JavaScript context. This makes it easier to change the template on the fly (see @aofl/i18n-mixin).

---
## Installation

**NPM**
```bash
npm i -S @aofl/web-components
```

## How to use it

```javascript
import AoflElement from '@aofl/web-components/aofl-element';

class ExampleComponent extends AoflElement {
  constructor() {
    // Always call super() first
    super();
  }

  ...
}
```

## Lifecycle hooks

AoflElement extends LitElement which extends HTMLElement, so all of their lifecycle hooks are available to AoflElement. You can make use of these callbacks by overriding them inside a custom element's class definition:

```javascript
import AoflElement from '@aofl/web-components/aofl-element';

class ExampleComponent extends AoflElement {
  connectedCallback() {
    super.connectedCallback();
  }

  ...
}
```

Here are all the lifecycle callbacks available to AoflElement:

#### Inherited from HTMLElement

- `connectedCallback`: Invoked when the custom element is first connected to the document's DOM.
- `disconnectedCallback`: Invoked when the custom element is disconnected from the document's DOM.
- `adoptedCallback`: Invoked when the custom element is moved to a new document.
- `attributeChangedCallback`: Invoked when one of the custom element's attributes is added, removed, or changed.

More details can be found [here](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks)

#### Inherited from LitElement

Here is the update lifecycle for LitElement-based components:
1. A property is set.
2. The property’s `hasChanged` function evaluates whether the property has changed.
3. If the property has changed, `requestUpdate` fires, scheduling an update.
4. `shouldUpdate` checks whether the update should proceed.
5. If the update should proceed, the `update` function reflects the element’s properties to its attributes.
6. The lit-html `render` function renders DOM changes.
7. The `updated` function is called, exposing the properties that changed.
8. The `updateComplete` Promise resolves. Any code waiting for it can now run.

More details can be found [here](https://lit-element.polymer-project.org/guide/lifecycle)

## Templating
Templating in aofljs is handled by lit-html. Lit-html is a small and fast HTML templating library that allows embedded javascript expressions. Lit-html templates are tagged with lit-html's `html` tag and enclosed in backticks ( ` ) with dynamic content handled using ${expression}:
```javascript
html`<h1>Hello ${name}</h1>`
```

### Bind to attributes
Expressions can also be used to create dynamic attributes:
```javascript
// set the class attribute
html`<div class=${data.cssClass}>Stylish text.</div>`;
```

### Bind to properties
You can bind to a node's javascript properties using the `.` prefix and the property name:
```javascript
html`<my-list .listItems=${context.items}></my-list>`
```
You can use property bindings to pass complex data down the tree to subcomponents.

### Boolean attributes
Use the `?` prefix for a boolean attribute binding. The attribute is added if the expression evaluates to a truthy value, removed if it evaluates to a falsy value:
```javascript
html`<p ?disabled="${!context.active}">Some text</p>`;
```

### Event handlers
Event handlers are specified with the `@` prefix followed by the event name:
```javascript
html`<button @click=${(e) => context.clickHandler(e)}>Click Me!</button>`
```

### Repeating templates
All control flow, looping, etc is handled with javascript. Here is an example mapping a list array to an html list:
```javascript
html`
  <ul>
    ${items.map((item) => html`<li>${item}</li>`)}
  </ul>
`;
```

More details on how lit-html handles templating can be found [here](https://lit-html.polymer-project.org/guide/writing-templates)

## Properties
AoflElement as a simple extension of LitElement handles properties in the same way. Here are some of the basics:

### Declaration
To declare properties add a properties getter inside your class
```javascript
static get properties() {
  return {
    prop1: { type: String },
    prop2: { type: Number },
    prop3: { type: Boolean }
  };
}
```

### Property options
Your properties may be further configured with a property declaration
- Configure corresponding attributes and their behavior with the `type`, `attribute` and `reflect` options.
- Specify the `hasChanged` function to control what constitutes a change for this property.

Your property declaration can be specified in the `properties` getter
```javascript
/**
 * An example property declaration
 */
{
  // Specifies how to convert between property and attribute.
  type: String,

  // Specifies corresponding observed attribute.
  attribute: 'my-prop',

  // Specifies whether to reflect property to attribute on changes.
  reflect: true,

  // Specifies how to evaluate whether the property has changed.
  hasChanged(newValue, oldValue) { ... },
}
```

### Initialize properties
Properties may be initialized in the constructor:
```javascript
constructor() {
  // Dont forget the call to super()
  super();
  this.prop1 = 'Hi';
  this.prop2 = 1;
  this.prop3 = true;
}
```

Values may also be supplied through markup:
```html
<my-element prop1="Hi" prop2="1" ?prop3="${true}"></my-element>
```
Values initialized via markup will override those initialized in the constructor.

More details on properties can be found [here](https://lit-element.polymer-project.org/guide/properties)

## Styling in the shadow dom

### host
Use `:host` to style the host element:
```css
:host[hidden] {
  display: none;
}

:host {
  display: block;
}
```
Child elements in your template will inherit CSS properties you assign to your host via the `:host` CSS pseudo-class

You may also set styles for the host outside the element by using it's tag as a selector. For example:
```css
my-element {
  font-family: Roboto;
  font-size: 20;
  color: blue;
}
```
Note that this will have a **lower** specificity than the `:host` pseudo-selector

More details on styling can be found [here](https://lit-element.polymer-project.org/guide/styles)