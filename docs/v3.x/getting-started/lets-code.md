# Let's Code

So far you have read about some of the features of AofL JS and learned how to install the starter app. It's time to see some of these features in action.

## Create a new Component

Run the generate command from `@aofl/cli` to scaffold a new component.

<!-- prettier-ignore -->
```bash
npx aofl g c src/modules/my-first-component
```

Now import `my-first-component` in `routes/home/template.js` and add the component tag to the template.

<!-- prettier-ignore -->
```javascript
import '../../modules/my-first-component';
...
export default (context, html) => html`
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
npx aofl g c src/routes/about
```

Update `routes/about/index.js` and add the routes annotation to the top of the file. AofL JS will automatically generate and maintain the routes configuration object based on the content of this block comment. Check the full documentation on [@aofl/templating-plugin](https://www.npmjs.com/package/@aofl/templating-plugin#route-annotation).


```javascript
/**
 * @route /about/
 * @title AofL::About
 */
import styles from './template.css';
import template from './template';
import {AoflElement, customElement} from '@aofl/element';

/**
 * @summary About
 * @extends {AoflElement}
 */
@customElement('about-element')
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
  static is = 'about-element';
  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

export default About;
```

_Note that the our custom tag [must contain a dash (-) character](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#High-level_view)._

Run `npm run start:dev` and go to http://localhost:8080/about/ to see the newly created page.

Now that you have setup the starter app and are able to create components and routes please take the time and read the material under Housekeeping.

_At this point you can continue to the Tutorials section or AofL JS Concepts section._

## Global Styles

Shadow DOM provides encapsulation for JS and CSS. This is great for publishing self contained components. However,
within a project it is desireable to inherit templatized styles (buttons, form elements, spacing, ...)
in our components without copying the same styles or recreating "styled" components (e.g. wrapping a button in a component just to add styling).

[`@aofl/webcomponents-css-loader`](https://www.npmjs.com/package/@aofl/webcomponent-css-loader) provides the
means to import template styles from `src/template`. In development mode all styles are imported to ensure fast
build times. However, in production builds all unused styles are purged from the final bundle.

To activate the loader the template.css files should start with `/*! @aofl-component */` and any number
of css files can be imported into the styles.

```css
/*! @aofl-component */
@import url('../../template/main/css/index.css');

:host {
  display: inline-block;
}
```
