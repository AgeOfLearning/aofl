# @aofl/aofl-element

`aofl-element` extends `lit-element` and overrides the `_render()` function. It accepts a template function and an String[] of styles. It is intented to be used in place of `lit-element` as the base class for elements. In it's current version it doesn't do much other than provide a clean interface to sperate HTML, CSS and JavaScript context. It makes it easier to change the template on the fly (see @aofl/i18n-mixin.)

## Methods

| Name     | Parameters                                       | Description                  |
| -------- | ------------------------------------------------ | ---------------------------- |
| _render  | {Function} template, {String[]} styles           | Re-evaluate the example code |


## code example
```javascript
import {AoflElement} from '@aofl/web-components/aofl-element';
import template from './template.js',
import styles from 'index.css'

class MyElement extends AoflElement {
  static get is() {
    return 'my-element';
  }

  _render() {
    return super.render(template, [styles])
  };
}

customElements.define(MyElement.is, MyElement)
```
