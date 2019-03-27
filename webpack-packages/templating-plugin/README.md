# @aofl/templating-plugin

@aofl/templating-plugin creates multiple entry points and automatically generates the route config object for aofl-js applications. It uses a single template file and combines it with partial views, meta tags, title and locale based on annotated routes files to create index.html files for each route. Just create new route components or update current routes and the application will automatically update the routes config during build.

## Installation
```bash
npm i -D @aofl/@aofl/templating-plugin
```

## Usage
```javascript
const AofLTemplatingPlugin = require('@aofl/templating-plugin');

...
  plugins: [
    ...
    new AofLTemplatingPlugin({
      template: {
        name: 'main',
        template: path.resolve(__dirname, '..', 'templates', 'main', 'template.ejs'),
        filename: path.join('templates', 'main', 'template.html'),
        ...{ other html-webpack-plugin options }
      },
      routes: {
        mainRoutes: path.join(__dirname, '..', 'routes'),
        pattern: [
          path.join(__dirname, '..', 'routes', 'home', 'index.js')
        ],
        ignore: ['**/__build/**/*', '**/node_modules/**/*']
      }
    }),
    ...
  ]
...
```

## Options
| Name      | Type   | Default                                                                                                          | Description                                                                                                                         |
|-----------|--------|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| template  | Object | {}                                                                                                               | html-webpack-plugin options plus a `name` attribute that will be part of the route object.                                          |
| routes    | Object | {}                                                                                                               | Define route entry points. `mainRoutes`, `pattern` and optional `ignore`.                                                           |
| partials  | Object | {}                                                                                                               | Used to define static partial templates object where the keys are the partials name and the values are html-webpack-plugin options. |
| locale    | String | en-US                                                                                                            | Default locale for entry points.                                                                                                    |
| prerender | Object | ` {   timeout: 0,   externalServer: false,   schema: 'http',   host: 'localhost',   port: 8090 }` | Add timeout in ms on top of the when there are no more than 2 network connections for at least 500 ms.                              |

### template
The `template` object is used with html-webpack-plugin to generate the html for the entry points. In addition to the html-webpack-plugin options you must specify a name for the template. This attribute will be part of the generated routes config object.

```javascript
    ...
      new AofLTemplatingPlugin({
        template: {
          name: 'main',
          template: path.resolve(__dirname, '..', 'templates', 'main', 'template.ejs'),
          filename: path.join('templates', 'main', 'template.html'),
          ...htmlWebpackConfig(mode)
        }
        ...
```

### routes
`routes` is used to find the routes entry files. We can have multiple routes folders but only one of these folders can be the `mainRoutes`. `mainRoutes` will be under `routes` key in the generated routes config. Any other `routes-[anything here]` folder will be added to the routes configs under `[anything here]` key. These routes can be used for (A/B testing).

```javascript
  ...
    routes: {
      mainRoutes: path.join(__dirname, '..', 'routes'),
      pattern: [
        path.join(__dirname, '..', 'routes', 'other', 'index.js'),
        path.join(__dirname, '..', 'routes-a', 'home', 'index.js')
      ],
      ignore: ['**/__build/**/*', '**/node_modules/**/*']
    }
  ...
```

### locale
`options.locale` specifes the default locale for the application. Each route can specify a locale in the route annotations as explained below.

### partials
Static parial templates can be defined using partials key and can be added to template using template variables `aoflTemplate:partial:[partial-name]`. For Example, header and footer areas. Partials should be html-webpack-plugin options.

```javascript
// webpack.config.js
...
  partials: {
    header: {
      template: path.join(__dirname, '..', 'js', 'header', 'view.ejs'),
      filename: path.join('js', 'header', 'view.html'),
      ...other-html-webpack-plugin-options
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

### prerender
`options.prerender` allows for customizing the prerender server.

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

## example @aofl/unit-testing-plugin/routes.config.js
```javascript
export default {
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
