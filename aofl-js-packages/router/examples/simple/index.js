import Router from '../../src/Router';
const config = [
  {
    path: '/',
    resolve: () => import('./pages/home.html'),
    default: true
  },
  {
    path: '/about/bob/:occupation',
    resolve: () => import('./pages/bob-occupation.html')
  },
  {
    path: '/about/:person/:occupation',
    resolve: () => import('./pages/occupation.html')
  },
  {
    path: '/about/:person',
    resolve: () => import('./pages/about.html')
  },
  {
    path: '/about',
    resolve: () => import('./pages/about.html')
  },
  {
    path: '/about/bob',
    resolve: () => import('./pages/bob.html')
  },
  {
    path: '/login',
    resolve: () => import('./pages/login.html')
  },
  {
    path: '/:foo/:bar',
    resolve: () => import('./pages/foobar.html')
  }
];


document.onreadystatechange = function documentListener() {
  if (document.readyState === 'interactive') {
    const router = new Router();
    router.init(config);
    router.navigate('/', true); // load initial route

    let menu = document.getElementsByTagName('nav')[0];
    let pageContent = document.getElementById('page-content');

    router.beforeEach((request, response, next) => {
      if (request.to === '/about/bob') {
        response.to = '/login';
      }
      next(response);
    });

    router.after((request, response, next) => {
      response.matchedRoute.resolve()
      .then((content) => {
        pageContent.innerHTML = content.default;
        next(response);
      });
    });

    router.after((request, response, next) => {
      let currentPath = document.getElementById('current-path');
      if (currentPath !== null) {
        currentPath.innerText = location.pathname || '/';
      }
      if (/about/.test(response.to)) {
        if (response.matchedRoute.props !== undefined) {
          let person = document.getElementById('person');
          let occupation = document.getElementById('occupation');
          if (person) person.innerText = response.matchedRoute.props.person;
          if (occupation) occupation.innerText = response.matchedRoute.props.occupation;
        }
      }
      next(response);
    });

    menu.addEventListener('click', (evt) => {
      if (evt.target.localName !== 'a') return;
      router.navigate(evt.target.dataset.path);
    });
  }
};
