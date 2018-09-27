# @aofl/templating-plugin

@aofl/templating-plugin works along side html-webpack-plugin to create multiple entry points for aofl-js applications. It uses a single template file and mixes it with static partials, meta tags, title and locale based on annotated routes files. It automates the generation of routes json file base on the routes files. Just create new route components or update current routes and the application will automatically update the routes config during build.

## Installation
```bash
npm i -D @aofl/@aofl/templating-plugin
```

## Usage
```javascript
const htmlWebpackConfig = require('./html-webpack-config');
const AofLTemplatingPlugin = require('@aofl/templating-plugin');

...
  plugins: [
    ...
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.ejs'),
      filename: 'templates/main/template.html',
      ...htmlWebpackConfig(mode) // see [aofl-starter](https://github.com/AgeOfLearning/aofl-starter) for these settings
    }),
    new AofLTemplatingPlugin({
      template: path.resolve(__dirname, 'template.ejs'),
      templateFilename: 'templates/main/template.html',
      filename: 'index.html',
      mainRoutes: 'routes',
      locale: 'en-US',
      inlineConfig: true,
      routes: {
        pattern: path.join(__dirname, '..', 'routes*', '*', 'index.js'),
        ignore: ['**/__build/**/*', '**/node_modules/**/*']
      }
    })
  ]
...
```

## Options
| Name             | Type   | Default                                                                                                                       | Description                                                                                    |
|------------------|--------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| template         | String | template.html                                                                                                                 | Input template file path. It must match the template option of HtmlWebpackPlugin.            |
| templateFilename | String | template.html                                                                                                                 | Must match the filename option of HtmlWebpackPlugin.                                         |
| filename         | String | index.html                                                                                                                    | Application entry point filename.                                                              |
| routes           | Object | ```{   pattern: path.join(__dirname, '..', 'routes*', 'index.js'),   ignore: ['**/__build/**/*', '**/node_modules/**/*'] }``` | Patterns for finding routes entry files. These files should include the routing comment block. |
| mainRoutes       | String | routes                                                                                                                        | Name of the main routes folder.                                                                |
| locale           | String | en-US                                                                                                                         | Default locale for the routes.                                                                 |
| partials         | Object | {}                                                                                                                            | Used to define static partial templates.                                                       |

### template & templateFilename
These optionsa are used to identify the template file and accessing the output of html-webpack-plugin.


### filename
@aofl/templating-plugin will create entry points for each route and place an entry point file in each directory in the output folder. For example, in an application where there are a `/` and `/about` routes the output directory will contain `/index.html` and `/about/index.html`.

### routes
`options.routes` is used to find the routes entry files. We can have multiple routes folders but only one of these folders can be the `mainRoutes`. The other folders will be added to the routes.config.js file as rotations (A/B testing).

```javascript
  ...
  routes: {
    pattern: path.join(__dirname, '..', 'routes*', '*', 'index.js'),
    ignore: ['**/__build/**/*', '**/node_modules/**/*']
  }
  ...
```

### mainRoutes
`options.routes` specifies the main routes folder for the application.

### locale
`options.locale` specifes the default locale for the application. Each route can specify a locale in the route annotations as explained below.

### partials
Static parial templates can be defined using partials key and can be added to template using template variables `aoflTemplate:partial:[partial-name]`. For Example, header and footer areas.

```javascript
// webpack.config.js
...
  partials: {
    header: {
      pattern: path.join(__dirname, '..', 'js', 'header', '*.ejs'),
      ignore: ['**/__build/**/*', '**/node_modules/**/*'],
      filename: 'view-[chunkhash].html',
      static: true
    }
  }
...
```

```html
<!-- template.ejs -->
...
<body>
  aoflTemplate:partial:header
  ...
```

## Template Keywords

### aoflTemplate:locale

```html
<!DOCTYPE html>
<html lang="aoflTemplate:locale">
  ...
```

### aoflTemplate:title
```html
<html lang="aoflTemplate:locale">
  <head>
    <title>aoflTemplate:title</title>
    ...
```

### aoflTemplate:metaTags
```html
 <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    aoflTemplate:metaTags
    ...
```
### aoflTemplate:parial:[partial-name]
```html
<!-- template.ejs -->
...
<body>
  aoflTemplate:partial:header
  ...
```

## Route Annotation
@aofl/templating plugin generates the routes.config.js file based on comment blocks found in the index.js file of the routes.


```javascript
/**
 * @route /
 * @title AofL::Home::CN
 * @metaTag {name:"description", content="Our awesome homepage"}
 * @metaTag {name:"viewport", content:"width=device-width, initial-scale=1"}
 * @meta {
 *   debug: false,
 *   template: 'main',
 *   requiresAuthentication: true
 * }
 * @prerender false
 * @locale zh-CN
 */

import template from './template';
import styles from './styles.css';
import AoflElement from '@aofl/web-components/aofl-element';
/**
 * @extends {AoflElement}
 */
class CnZhHomePage extends AoflElement {
  ...

```

Supported Tags
| Name       | Type   | Description                                                                                                                                                 |
|------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @route     | String |                                                                                                                                                             |
| @title     | String | Title of the page                                                                                                                                           |
| @metaTag   | Object | Define a meta tag for the route. Multiple @metaTags can be used on a page. E.g. `@metaTag {name:"viewport", content:"width=device-width, initial-scale=1"}` |
| @meta      | Object | Application specific route meta data.                                                                                                                       |
| @locale    | String | Route specific locale. This value overrides the locale specified in the config.                                                                             |
| @prerender | String | Specifies whether the page should be pre-rendered during production build.                                                                                  |


## example routes.config.js

```javascript
window.aofljsConfig = window.aofljsConfig || {};
window.aofljsConfig.routesConfig = {
  'routes': [
    {
      'resolve': () => import('./routes-cn_zh/home/index.js'),
      'rotation': 'routes',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home::CN',
      'meta': {
        'debug': false,
        'template': 'main',
        'requiresAuthentication': true,
      },
      'locale': 'zh-CN',
      'template': 'main'
    },
    {
      'resolve': () => import('./routes-cn_zh/login/index.js'),
      'rotation': 'routes',
      'path': '/login/',
      'dynamic': false,
      'title': 'AofL::Login::CN',
      'locale': 'zh-Cn',
      'template': 'main'
    }
  ],
  'b-test': [
    {
      'resolve': () => import('./routes-b-test/home/index.js'),
      'rotation': 'b-test',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home::B',
      'locale': 'zh-CN',
      'template': 'main'
    }
  ]
};

```
