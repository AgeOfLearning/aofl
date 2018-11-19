# Let's Code

So far you have read about some of the features of AofL JS and learned how to install the starter app. It's time to see some of these features in action.

## Create a new Component

Run the generate command from `@aofl/cli` to scaffold a new component.

```bash
npx aofl g c routes/home/modules/my-first-component
```

Now import `my-first-component` in `routes/home/template.js` and add the component tag to the template.

```javascript
import './modules/my-first-component';
...
export const template = (context, html) => html`
  ...
  <my-first-component></my-first-component>
  ...
`;
...
```

Run `npm run start:dev` to see the change.

## Create a new Route

We'll create new route for `/about`.

```bash
npx aofl g c routes/about
```

Update `routes/about/index.js` and add the routes annotation to the top of the file. AofL JS will automatically generate and maintain the routes configuration object based on the content of this block comment. Check the full documentation on [@aofl/templating-plugin](https://www.npmjs.com/package/@aofl/templating-plugin#route-annotation).

```javascript
/**
 * @route /about/
 * @title AofL::About
 */
import styles from "./template.css";
import template from "./template";
import AoflElement from "@aofl/web-components/aofl-element";

/**
 * @summary About
 * @class About
 * @extends {AoflElement}
 */
class About extends AoflElement {
  /**
   * Creates an instance of About.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return "about-page";
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(About.is, About);

export default About;
```

_Note that `Component.is` variable [must contain a dash (-) character](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#High-level_view)._

Run `npm run start:dev` and go to http://localhost:8080/about/ to see the newly created page.

Now that you have setup the starter app and are able to create components and routes please take the time and read the material under Housekeeping.

_At this point you can continue to the Tutorials section or AofL JS Concepts section._
