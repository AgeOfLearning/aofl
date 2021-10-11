import {MiddlewareFunction} from '@aofl/middleware';
/**
 * Updates the url of the page based on matched route.
 */
const updateUrlMiddleware : MiddlewareFunction = (request: any, response: any, next: any) => {
  let err = null;
  try {
    if (!request.options.poppedState) {
      if (request.options.replaceState) {
        window.history.replaceState(null, '', response.to);
      } else {
        window.history.pushState(null, '', response.to);
      }
    }
  } catch (e) {
    err = e;
  }
  next(response, err);
};

export {updateUrlMiddleware};
