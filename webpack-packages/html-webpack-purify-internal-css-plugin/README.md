# @aofl/html-webpack-purify-internal-css-plugin

This is a plugin for [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). It uses [PurgeCSS](https://purgecss.com/) to remove all unused css rules from internal styles of the generated html.

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
| auto      | This is the default behavior. It prunes unused css rules based on the generated html and the purgeCss options. |
| safelist | Only keep whitelisted rules.                                                                                    |
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

### purgeCss

[purgeCss options](https://purgecss.com/configuration.html#options)

```javascript
module.export = {
  ...
  plugins: [
    new HtmlWebpackPurifyInternalCssPlugin({
      level: process.env.NODE_ENV === 'development'? 'none': 'auto',
      purgeCss: {
        fontFace?: boolean,
        keyframes?: boolean,
        rejected?: boolean,
        variables?: boolean,
        safelist?: UserDefinedSafelist,
        blocklist?: StringRegExpArray,
      }
    })
  ]
}
```
