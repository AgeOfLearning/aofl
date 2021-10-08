# @aofl/element


AoflElement is a simple base class that extends litElement. It allows us to implement custom
functionality at the base class level while utilizing the awesome power of lit. These include
integration with @aofl/store, @aofl/hmr-loader and @aofl/i18n-mixin.

#

[Api Documentation](https://ageoflearning.github.io/aofl/v4.x/api-docs/modules/_aofl_element.html)


## code example
```javascript
import {AoflElement, customElement, HtmlType} from '@aofl/aofl-element';
import {css} from 'lit';

@customElement('home-element')
class Home extends AoflElement {
  static get styles() {
    return css`
    :host {
      display: block;
    }
    `;
  };

  get template() : AoflElementTemplate {
    return (ctx: Home, html: htmlType) => html`
      <p>My template file</p>
    `;
  }
}
```
