# @aofl/i18n-mixin

The **AOFL i18nMixin element** decorates any element with **i18n** support.


## Requirements

For each component which will support internationalization an `i18n` directory will need to be created in the root of the component directory. Inside this directory language `.po` files will be expected.

A `translations.pot` file will be generated via running `aofl i18n`. The command will find all component template instances of translation method strings, e.g. `__('string to translate'), _n('more strings')`.

The `translations.pot` can be used by a tranlsations api or translators to create the necessary language.po files in the format of `lang-LOCALE.po`, e.g. `en-US` or `pt-BZ.po`, which again will be expected in the compontent's `i18n` directory.

Finally the component class will need to set the current language, e.g. `this.lang = 'pt-BZ';`

## Usage with i18n Loader

Finally the `i18n-loader` will be required.

Run `npm i -D @aofl/i18n-loader`

Then add the loader to your webpack config:

```js
module: {
  rules: [
    {
      test: /language\.js$/,
      use: '@aofl/i18n-loader'
    }
  ]
}
```

## Multiple template support

The AOFL mixin supports multiple template to be rendered based on the currently set `lang`. For instance if `de-DE` is the selected language then the template associated with that language will be rendered.

**The render method expects a template object like so:**
```js
return super._render({
  default: {
    template(context, html) {
      return html`<h2>${context.__('How are you %s1', context.person)}</h2>`
    },
    styles: []
  },
  'de-DE': {
    template(context, html) {
      return html`
        <h1>German version</h1>
        <h2>${context.__('How are you %s1', context.person)}</h2>
        <p>${context._n({
          1: 'There is one person here and that person is %s1',
          2: 'There are two people here',
          3: 'There are many people here!'
        }, context.count, context.person)}</p>
      `;
    },
    styles: []
  }
})
```

## Methods

| Name | Arguments  | Description                  |
| ---- | ---------- | ---------------------------- |
| __()  |  s[String], ...contexts[Number\|String]    | Translates the given string |
| _n()  |  variants[Object], count[Number], ...contexts[Number\|String]    | Translates the given string, supporting plural variants |

## code example
```javascript
import i18nMixin from '@aofl/i18n-mixin';
import AoflElement from '@aofl/web-components/aofl-element';
import styles from './styles.css';

class MyComp extends i18nMixin(AoflElement) {
  constructor() {
    super();
    this.langMap = langMap;
    this.lang = 'de-DE';
  }
  static get is() {
    return 'my-comp';
  }
  _render() {
    let person = 'Albert';
    let count = 1;
    return super._render({
      default: {
        template(context, html) {
          return html`<h2>${context.__('How are you %s1', context.person)}</h2>`
        },
        styles: []
      },
      'de-DE': {
        template(context, html) {
          return html`
            <h1>German version</h1>
            <h2>${context.__('How are you %s1', context.person)}</h2>
            <p>${context._n({
              1: 'There is one person here and that person is %s1',
              2: 'There are two people here',
              3: 'There are many people here!'
            }, context.count, context.person)}</p>
          `;
        },
        styles: []
      }
    });
  }
};
```
