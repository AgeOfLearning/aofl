# AOFL ROUTER

## Getting started

`npm i @aofl/aofl-router`

### Basic usage

_Sample route config and router instantiation "my-router.js"_

```js
import Router from '@aofl/router';

const config = [
  {
    url : '/',
    resolve: () => import('./pages/home.html'),
    default: true,
  },
  {
    url: '/about/:person',
    resolve: () => import('./pages/about.html')
  },
  {
    url: '/about/:person/:occupation',
    resolve: () => import('./pages/occupation.html')
  }
];

const myRouter = new Router(config);

export default myRouter;
```

_Create a Link to component_

```js

import {LitElement, html} from '@polymer/lit-element';
import myRouter from 'my-router';

class LinkTo extends LitElement {
  constructor() {
    super();
  }
  __onClick() {
    myRouter.navigate(this.href);
  }

  static get properties() {
    return {
      href: String
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', (e) => {
      e.stopPropegation();
    }, true);

  }
  _render() {
    return html`<slot></slot>`;
  }
}
customElements.define('link-to', LinkTo);
```

__Usage__
```html
  <nav>
    <link-to href="/"><a href="/">Go Home</a></link-to>
    <link-to href="/about/bob"><a href="/about/bob">About Bob</a></link-to>
    <link-to href="/about/bob/plumber"><a href="/about/bob/plumber">About Bob the Plumber</a></link-to>
  </nav>
```

## Adding middleware

Middlewares of each type (before, beforeEach, afterEach, after) are called in the order in which they were registered within their group.

__Middleware callback signature__
```js
router[before|beforeEach|afterEach|after].(function(request, response, next) {})
```
`request`: {to: String, from: String} | Immutable original request object. Should never be modified.

`response`: {to: String, from: String, `*matchedRoute`: Object} | Begins as a clone of request. Can be modified in `before` and `beforeEach` middleware.

* `matchedRoute` will be the matched object from the route config.
* The `response` object should be used to store and pass information down the middleware chain.
* Redirects are made by updating `response.to` in `before` or `beforeEach` middleware.

`next`: The next method must be called with the `response` object. Else the middleware chain will break and the route update will not occur.

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

## Middleware hooks

__Router.before(fn)__

Executes before a route has even been matched. Middleware here should be any prep work that needs to happen before a route begins to resolve. It will note be provided a matched route at this point.

__Router.beforeEach(fn)__

Exectues after all "before" middleware. At this point a `matchedRoute` will be available in the `response` object passed to the middleware callback. Redirects can occur here.

__Router.afterEach(fn)__

Exectues after all "beforeEach" middleware. Again a `matchedRoute` will be available in the `response` object passed to the middleware callback. The response body may also indicate a redirected route from a `beforeEach` middeleware; this allows afterEach middleware to act on that information. No redirects however, are allowed at this point. So any changes to `redirect.to` will be ignored.

__Router.after(fn)__

Middleware here executes after the route has been updated in the browser. At least one middleware function is required here to call the `resolve()` method on the `matchedRoute` object so that the view's component can be fetched and the view updated.