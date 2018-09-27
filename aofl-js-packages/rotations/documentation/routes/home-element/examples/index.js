
context.message = 'hello preview message';
context.count = 0;
context.drawer = false;

context.toggleDrawer = () => {
  context.drawer = !context.drawer;
};

let routeConfig = {
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

let rotationsConfig = {
  'page_rotations': {
    '/': [1, 2]
  },
  'rotation_id_keyname_map': {
    '1': 'routes',
    '2': 'routes-b'
  },
  'rotation_version_page_group_version_map': {
    '1000': 'routes',
    '2000': 'routes-b'
  },
  'rotation_versions': {
    '1': {
      '1000': '2',
      '2000': '1'
    },
    '2': {
      '1000': '1',
      '2000': '1'
    }
  }
};
let rotationConditions = {
  'routes': (resolve, reject) => {
    resolve(false);
  },
  'routes-b': (resolve, reject) => {
    resolve(true);
  }
};

let rotations = new Rotations('my-rotations', routeConfig, rotationsConfig, rotationConditions);

rotations.getRoutes().then((routes) => {
  context.routes = routes;
});
