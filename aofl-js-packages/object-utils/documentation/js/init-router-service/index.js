import {routerInstance} from '@aofl/router';

const routes = window?.aofljsConfig?.routesConfig?.routes || [];
const otherwise = '/';
const otherwiseExists = routes.some((item) => item.path === otherwise);

routerInstance.afterEach((request, response, next) => {
  if (response.matchedRoute !== null) {
    next(response);
  } else if (otherwiseExists) {
    routerInstance.navigate(otherwise, true, false, true);
  }
});

routerInstance.init(routes);
routerInstance.navigate(location.pathname, true, true);
