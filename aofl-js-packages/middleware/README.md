# @aofl/middleware

Simple base middleware class.

## Installation
```bash
npm i -S @aofl/middleware
```

## Methods

| Name              | Arguments                                       | Description                                                                          |
|-------------------|-------------------------------------------------|--------------------------------------------------------------------------------------|
| constructor       | ...[String]                                     | Define any number of middleware hooks. E.g. `new Middleware('before', 'after', ...)` |
| use               | cb[Function], hook[String]                      | Register a middleware                                                                |
| iterateMiddleware | request[Object], hook[String], response[Object] | Iterate middleware for a given hook                                                  |


## Example

```js
const matchRoutes = (request, response, next) => {
  // match route logic based on request and response

  next(response); // next should be called to process the next middleware function in the queue. Otherwise, the operation stops.
};

class Router {
  constructor() {
    // other initialization logic
    this.middleware = new Middleware('before', 'after');
    this.before(matchRoutes); // register matchRoutes middleware
    this.after(updateView); // register updateView Middleware
  }

  before(fn) {
    this.middleware.use(fn, 'before');
  }

  after(fn) {
    this.middleware.use(fn, 'after');
  }

  async navigate(request) {
    const beforeResponse = await this.middleware.iterateMiddleware(request, 'before', Object.assign({}, request)); // middleware functions expect request, and optional response
    await this.middleware.iterateMiddleware(request, 'after', beforeResponse);
  }

  // ... other Router logic
}
```
