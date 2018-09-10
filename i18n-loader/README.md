# @aofl/i18n-loader

The **\@aofl/i18n-loader** generates `language.js` files used by `@aofl/i18n-mixin` from `.po` files. See the `@aofl/i18n-mixin` docs for more usage details.

## Getting started

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
