# @aofl/html-webpack-purify-internal-css-plugin

This is a plugin for [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). It uses [PurifyCSS](https://github.com/purifycss/purifycss) to remove all unused css rules from internal styles of the generated html.

## Installation

```bash
npm i -D @aofl/html-webpack-purify-internal-css-plugin
```

## Usage

<!-- prettier-ignore -->
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPurifyInternalCssPlugin = require('@aofl/html-webpack-purify-internal-css-plugin');

module.export = {
  ...
  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackPurifyInternalCssPlugin()
  ]
}
```

## Options

### level

Level specifies pruning strategy.

| option    | Description                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| auto      | This is the default behavior. It prunes unused css rules based on the generated html and the purifyCss options. |
| whitelist | Only keep whitelisted rules.                                                                                    |
| all       | Prune everything                                                                                                |
| none      | Prune nothing. (Useful for development to be able to toggle classes in devtools)                                |

<!-- prettier-ignore -->
```javascript
module.export = {
  ...
  plugins: [
    new HtmlWebpackPurifyInternalCssPlugin({
      level: process.env.NODE_ENV === 'development'? 'none': 'auto'
    })
  ]
}
```

### purifyCSS

[PurifyCSS options](https://github.com/purifycss/purifycss#properties-of-options-object)

| Option    | Description                                                                                                                                                                                                                                  | default      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| minify    | Set to true to minify                                                                                                                                                                                                                        | false        |
| output    | Filepath to write purified CSS to. Returns raw string                                                                                                                                                                                        | Always false |
| info      | Logs info on how much CSS was removed                                                                                                                                                                                                        | false        |
| rejected  | Logs the CSS rules that were removed if `true`                                                                                                                                                                                               | false        |
| whitelist | Array of selectors to always leave in. Ex. ['button-active', '*modal*'] this will leave any selector that includes modal in it and selectors that match button-active. (wrapping the string with \*'s, leaves all selectors that include it) | []           |

<!-- prettier-ignore -->
```javascript
module.export = {
  ...
  plugins: [
    new HtmlWebpackPurifyInternalCssPlugin({
      level: process.env.NODE_ENV === 'development'? 'none': 'auto',
      purifyCSS: {
        info: true,
        rejected: true,
        whitelist: [
          '.♥'
        ]
      }
    })
  ]
}
```
