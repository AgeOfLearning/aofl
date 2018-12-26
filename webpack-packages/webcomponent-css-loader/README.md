# @aofl/webcomponent-css-loader

The **\@aofl/webcomponent-css-loader** A loader that shares pruned global styles between web components.

## Getting started

Run `npm i -D @aofl/webcomponent-css-loader`

Then add the loader to your webpack config:

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        {
          loader: '@aofl/webcomponent-css-loader',
          options: {
            sourceMap: false
            path: path.resolve(__dirname, '..', 'templates', 'main', 'css', 'index.css'),
            force: false // when true prunes current css file even if no template.js or index.js files exist
          }
        }
      ]
    }
  ]
}
```
