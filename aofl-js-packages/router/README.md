# @aofl/router

AOFL Router is a simple client side router. It supports the history API, dynamic paths and provides multiple middleware hooks. It makes no path rendering assumptions.

## Examples
* https://stackblitz.com/edit/1-0-0-router?embed=1

## Installation
```bash
$ npm i -S @aofl/router
```

## Middleware hooks

| Name         | Arguments                     | Description                  |
| ------------ | ----------------------------- | ---------------------------- |
| before       |  fn[Function]  | Executes before a route has even been matched. Middleware here should be any prep work that needs to happen before a route begins to resolve. It will note be provided a matched route at this point. |
| beforeEach   |  fn[Function]  | Executes after all "before" middleware. At this point a `matchedRoute` will be available in the `response` object passed to the middleware callback. Redirects can occur here. |
| afterEach    |  fn[Function]  | Executes after all "beforeEach" middleware. Again a `matchedRoute` will be available in the `response` object passed to the middleware callback. The response body may also indicate a redirected route from a `beforeEach` middleware; this allows afterEach middleware to act on that information. No redirects however, are allowed at this point. So any changes to `redirect.to` will be ignored. |
| after        |  fn[Function]  | Middleware here executes after the route has been updated in the browser. At least one middleware function is required here to call the `resolve |

#### Middleware fn signature

**_fn(request, response, next)_**

`request`: {to: String, from: String} | Immutable original request object. Should never be modified.

`response`: {to: String, from: String, `*matchedRoute`: Object} | Begins as a clone of request. Can be modified in `before` and `beforeEach` middleware.

* `matchedRoute` will be the matched object from the route config.
* The `response` object should be used to store and pass information down the middleware chain.
* Redirects are made by updating `response.to` in `before` or `beforeEach` middleware.

`next`: The next method must be called with the `response` object. Else the middleware chain will break and the route update will not occur.

__Sample middleware__
```js
import myRouter from 'my-router';

// Middleware to redirect any requests to the /private dir to /login
router.before(function(request, response, next) {
  if (/private/.test(request.to)) {
    response.to = '/login';
  }
  next(response);
})
```

## Properties

none

## Methods

| Name | Arguments  | Description                  |
| ---- | ---------- | ---------------------------- |
| init | `config[Object]` | Initialize the router with the router configuration object |
| navigate | `path[String]`, `force[Boolean]`, `popped[Boolean]`, `meta[Object]`  | performs path match and applies middleware |

\*\* See middleware hooks for middleware methods
