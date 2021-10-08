# @aofl/middleware

Simple middleware class.

#

[Api Documentation](https://ageoflearning.github.io/aofl/v4.x/api-docs/modules/_aofl_middleware.html)

## Installation
```bash
npm i -S @aofl/middleware
```

## Example

```js
const matchRoutes = (request, response, next) => {
  // match route logic based on request and response

  next(response, [err | void]); // next should be called to process the next middleware function in the queue. Otherwise, the operation stops.
};

class Router {
  constructor() {
    this.middleware = new Middleware('before', 'after');
    this.before(matchRoutes); // register matchRoutes middleware
    this.after(updateView); // register updateView Middleware
  }

  before(fn) {
    this.middleware.use('before', fn);
  }

  after(fn) {
    this.middleware.use('after', fn);
  }

  async navigate(request) {
    const beforeResponse = await this.middleware.iterateMiddleware('before', request, Object.assign({}, request)); // middleware functions expect request, and optional response
    await this.middleware.iterateMiddleware('before', request, beforeResponse);
  }
}
```
