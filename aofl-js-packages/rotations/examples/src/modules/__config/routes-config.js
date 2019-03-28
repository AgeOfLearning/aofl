export default {
  'routes': [
    {
      'resolve': () => Promise.resolve('routes homepage'), // import('component') in a real app
      'rotation': 'routes',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home'
    },
    {
      'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
      'rotation': 'routes',
      'path': '/about',
      'dynamic': false,
      'title': 'AofL::About'
    },
    {
      'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
      'rotation': 'routes',
      'path': '/subscribe',
      'dynamic': false,
      'title': 'AofL::Subscribe'
    }
  ],
  'routes-homepage_design_test': [
    {
      'resolve': () => Promise.resolve('routesB homepage'),
      'rotation': 'routes-homepage_design_test',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home',
      'locale': ''
    },
    {
      'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
      'rotation': 'routes-homepage_design_test',
      'path': '/about',
      'dynamic': false,
      'title': 'AofL::About'
    },
    {
      'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
      'rotation': 'routes-homepage_design_test',
      'path': '/subscribe',
      'dynamic': false,
      'title': 'AofL::Subscribe'
    }
  ],
  'routes-price_test_1': [
    {
      'resolve': () => Promise.resolve('routesB homepage'),
      'rotation': 'routes-price_test_1',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home',
      'locale': ''
    },
    {
      'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
      'rotation': 'routes-price_test_1',
      'path': '/about',
      'dynamic': false,
      'title': 'AofL::About'
    },
    {
      'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
      'rotation': 'routes-price_test_1',
      'path': '/subscribe',
      'dynamic': false,
      'title': 'AofL::Subscribe'
    }
  ],
  'routes-price_test_2': [
    {
      'resolve': () => Promise.resolve('routesB homepage'),
      'rotation': 'routes-price_test_2',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home',
      'locale': ''
    },
    {
      'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
      'rotation': 'routes-price_test_2',
      'path': '/about',
      'dynamic': false,
      'title': 'AofL::About'
    },
    {
      'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
      'rotation': 'routes-price_test_2',
      'path': '/subscribe',
      'dynamic': false,
      'title': 'AofL::Subscribe'
    }
  ],
  'routes-price_test_3': [
    {
      'resolve': () => Promise.resolve('routesB homepage'),
      'rotation': 'routes-price_test_3',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home',
      'locale': ''
    },
    {
      'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
      'rotation': 'routes-price_test_3',
      'path': '/about',
      'dynamic': false,
      'title': 'AofL::About'
    },
    {
      'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
      'rotation': 'routes-price_test_3',
      'path': '/subscribe',
      'dynamic': false,
      'title': 'AofL::Subscribe'
    }
  ]
};
