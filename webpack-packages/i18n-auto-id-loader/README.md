# @aofl/i18n-auto-id-loader

The **\@aofl/i18n-auto-id-loader** generates unique IDs and inserts them as the 1st argument to  __, _c fucntion calls in the source files.

## Getting started

Run `npm i -D @aofl/i18n-auto-id-loader`

Then add the loader to your webpack config:

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: '@aofl/i18n-auto-id-loader',
      enforce: 'pre'
    }
  ]
}
```
