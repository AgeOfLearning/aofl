# @aofl/rotations

The rotations class provides weight based view logic for A B testing. It takes a rotation configuration file alongside an initial route configuration file containing all possible routes and produces a finalized route configuration file containing only the selected routes based on the rotation configuration rules. It also caches the results per client.

Aofl Router works well in conjunction with Aofl Rotations. Other routers may be used as well if they take a configuration file that uses `path` as a key for the value of the route. See sample route config below.

### Rotations config example

```javascript
{
  'page_rotations': {
    '/': [1, 2]  // corresponds '/' path with rotation_id_keyname_map ids below.
  },
  'rotation_id_keyname_map': {
    '1': 'routes',
    '2': 'routes-b'
  },
  'rotation_version_page_group_version_map': {
    '1000': 'routes',
    '2000': 'routes-b'
  },
  // rotation versions and weights
  'rotation_versions': {
    '1': {
      '1000': '2', // version is 1000 and weight is 2
      '2000': '1' // version is 2000 and weight is 1
    },
    '2': {
      '1000': '1',
      '2000': '1'
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
      'title': 'AofL::Home::CN'
    }
  ],
  'routes-b': [
    {
      'resolve': () => import('./routes-b/home-b/index.js'),
      'rotation': 'routes-b',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home:IOS',
      'locale': ''
    }
  ]
};
```

### Sample Rotation conditions
```js
// each rotation route id is associated with an asychronouse function which resolves a boolean.
let rotationConditions = {
  'routes': (resolve, reject) => {
    resolve(false);
  },
  'routes-b': (resolve, reject) => {
    resolve(true);
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
routes-b
├── home-b
│   ├── index.js
│   ├── styles.css
│   ├── template.js
│   └── test
│       └── index.spec.js
```

The qualification logic begins by evaluating the `page_rotations` paths and corresponding rotation ids. They are evaluated against the rotation conditions functions and the first to evaluate to true is passed to the next qualification step which is the `rotations_versions`. Here the weight of the each rotation version is used to calculate which associated variant is shown. The key to the left in `rotations_versions` corresponds to the name in  `rotation_version_page_group_version_map` representing the final variant to show.


## Events

none

## Properties

none

## Methods

| Name | Agruments  | Description                  | Returns |
| ---- | ---------- | ---------------------------- | ------- |
| constructor  | cacheNameSpace [String],<br> routeConfig [Object],<br> rotationConfig [Object],<br> rotationConditions [Object] | Rotations constructor | void
| getRoutes | no arguments | Gets the route configuration | routeConfig [Array]&lt;Object&gt;