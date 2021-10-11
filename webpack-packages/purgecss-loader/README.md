# @aofl/webcomponent-css-loader

The **\@aofl/webcomponent-css-loader** is a webpack loader that inlines imported css in your component's bundle and prunes unused css.

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
            cache: true
          }
        }
      ]
    }
  ]
}
```

In addition to adding the loader to webpack config you must also place a comment block in css files that you want to be picked up by the loader. This allows us to set the pruning behavior per component/css file.

For more information visit [Purgecss docs.](https://www.purgecss.com/configuration)
```css
/**!
 * @aoflComponent
 * @whitelist ['modal']
 * @whitelistPatterns ['btn']
 * @whitelistPatternsChildren ['alert']
 * @keyFrames true
 * @fontFace true
 */
@import "~Root/node_modules/bootstrap/dist/css/bootstrap.css";

:host {
  display: inline-block;
}
```