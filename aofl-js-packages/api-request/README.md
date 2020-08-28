# @aofl/api-request

A module for making api calls easier. Key features include caching responses and request/response formatters.

Caching is implemented using @aofl/cache-manager and uses MemoryCache. @aofl/api-request caches the promises created by fetch api.

Request/response formatting referes to constructing a request payload and parsing the response payload. A formatter object should implement `pack()` and `unpack()` properties. `pack()` is to construct the request payload and `unpack()` is used to parse the response. Any number of formatters can be added to `apiRequestInstance` using the `addFormatter()` method. E.g. `GetFormatter`, `PostFormatter`, `CorsFormatter`, `FileUploadFormatter`, `GoogleMapsFormatter`, ....

[Api Documentation](https://ageoflearning.github.io/aofl/v3.x/api-docs/module-@aofl_api-request.html)

## Examples
* [Basic Example](https://codesandbox.io/s/github/AgeOfLearning/aofl/tree/v3.0.0/aofl-js-packages/api-request/examples/simple)

## Installation
```bash
npm i -S @aofl/api-request
```

## Usage
```javascript
import {ApiRequest} from '@aofl/api-request';

class PostFormatter {
  static pack(payload) {
    const headers = new Headers();
    const body = new FormData();

    if (typeof payload !== 'undefined') {
      body.append('arguments', JSON.stringify(payload));
    }

    return {
      method: 'POST',
      headers,
      body,
      mode: 'cors',
      credentials: 'include'
    };
  }

  static unpack(response) {
    return response.json()
    .then((data) => {
      if (data.status !== 'success') {
        return Promise.reject(data);
      }
      return data;
    });
  }
}

const apiRequestInstance = new ApiRequest();
apiRequestInstance.addFormatter('post', PostFormatter);

apiRequestInstance.request('https://example.org/', {}, 'post', true, 'sample-namespace')
.then((jsonResponse) => {
})
.catch((jsonResponse) => {
});
```
