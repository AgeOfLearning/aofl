# @aofl/rotations

The rotations class provides weight based view logic for A B testing. It takes a rotation configuration file alongside an initial route configuration file containing all possible routes and produces a finalized route configuration file containing only the selected routes based on the rotation configuration rules. It also caches the results per client.

Aofl Router works well in conjunction with Aofl Rotations. Other routers may be used as well if they take a configuration file that uses `path` as a key for the value of the route. See sample route config below.

## Examples
* https://codesandbox.io/s/github/AgeOfLearning/aofl/tree/master/aofl-js-packages/rotations/examples

## Installation
```bash
$ npm i -S @aofl/rotations
```

## Usage
### Rotations config example

```javascript
{
  'baseline_version': '1000',
  'conditions': {
    '2': 'homepage_design'
  },
  'qualification_order': {
    '/': ['2']
  },
  'versions': {
    '1000': 'routes',
    '1001': 'routes-homepage_design_test',
  },
  'weights': {
    '2': {
      '1000': 1,
      '1001': 1
    }
  }
}
```

### Sample Route config example

```js
{
  'routes': [
    {
      'resolve': () => import('./routes/home/index.js'),
      'rotation': 'routes',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home'
    }
  ],
  'routes-homepage_design_test': [
    {
      'resolve': () => import('./routes-homepage_design_test/home/index.js'),
      'rotation': 'routes-homepage_design_test',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home',
      'locale': ''
    }
  ]
};
```

### Sample Rotation conditions
```js
let rotationConditions = {
  'baseline': () => {
    return true;
  },
  'routes-homepage_design_test': (resolve, reject) => {
    return Promise.resolve(true); // works with promises too as long as the promise resolves with a boolean
  }
};
```


### Sample Directory structure

```
routes
├── home
│   ├── index.js
│   ├── styles.css
│   ├── template.js
│   └── test
│       └── index.spec.js
routes-homepage_design_test
├── home
│   ├── index.js
│   ├── styles.css
│   ├── template.js
│   └── test
│       └── index.spec.js
```

The qualification logic begins by iterating over baseline routes (routes folder) and evaluating the `conditions` based on `qualifying_order`. Next `weight` are evaluated based on the qualifying rotation and the appropriate `version` is used to generate the new routes array.

## Methods

| Name | Agruments  | Description                  | Returns |
| ---- | ---------- | ---------------------------- | ------- |
| constructor  | cacheNameSpace [String],<br> routeConfig [Object],<br> rotationConfig [Object],<br> rotationConditions [Object] | Rotations constructor | void
| getRoutes | no arguments | Gets the route configuration | routeConfig [Array]&lt;Object&gt;
