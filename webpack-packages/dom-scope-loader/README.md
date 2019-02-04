# @aofl/dom-scope-loader

The **\@aofl/dom-scope-loader** is a webpack loader that generates unique id's for specified html tags.

## Installation
```bash
npm i -D @aofl/dom-scope-loader
```

## Usage
```javascript
module: {
  rules: [
    {
      test: /\.html$/,
      use: [
        {
          loader: '@aofl/dom-scope-loader',
          options: {
            cache: true,
            tags: [
              'A',
              'SPAN'
            ]
          }
        }
      ]
    }
  ]
}
```

It turns the following `<a href="#">My Awesome Link</a>` into `<a dom-scope="UA\123" href="#">My Awesome Link</a>`
