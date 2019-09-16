# @aofl/hmr-loader

A HMR loader for Aofl JS applications.

## Getting Started

Run `npm i -S @aofl/hmr-loader`

Then add the loader to your webpack config:

```js
module: {
  rules: [
    {
      test: /\.js$/,
      enforce: 'pre',
      use: [
        {
          loader: '@aofl/hmr-loader',
          options: {
            cache: true
          }
        }
      ]
    }
  ]
}

```