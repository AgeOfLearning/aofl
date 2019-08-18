# @aofl/i18n

Implements `__()`, `_r()` and `_c()` functions for translations.


## Examples
WIP


## Requirements

For each component which will support internationalization an `i18n` directory will need to be created in the root of the component directory. Inside this directory language `translations-[language-contrycode].js` files will be expected.

A `translation.js` file will be generated via running `aofl i18n`. The command will find all component template instances of translation method strings, e.g. `__('string to translate'), _c('more strings')`.

The `translation.js` can be used by a tranlsations api or translators to create the necessary translation-[lang].js files in the format of `translation-LOCALE.js`, e.g. `translation-en-US` or `translation-pt-BZ.po`, which again will be expected in the compontent's `i18n` directory.

Finally the component class will need to set the current language, e.g. `this.lang = 'pt-BZ';`

## Usage with i18n Loader

`i18n-loader` is required.

Run `npm i -D @aofl/i18n`

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

## Usage

```js
import {I18n} from '@aofl/i18n';
import translations from './i18n';

const i18n = new I18n(translations);

console.log(i18n.__('This will be translated'));
console.log(i18n._r(i18n.__('Hello %r1%'), username));
console.log(i18n._c('You clicked %c1% times today and %c2% yesterday.' , {
  1: 'once',
  2: 'twice',
  3: 'a few times',
  4: 'a few times',
  5: 'a few times',
  '%other%': 'many times'
}, todayCount, {
  1: 'once',
  2: 'twice',
  3: 'a few times',
  4: 'a few times',
  5: 'a few times',
  '%other%': 'many times'
}, yesterdayCount)})
```
