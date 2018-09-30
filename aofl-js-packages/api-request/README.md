# @aofl/api-request

A module to make making api calls easier. Key features include, caching responses and request and response formatters.

Caching is implemented using @aofl/cache-manager and uses MemoryCache. @aofl/api-request caches the promises created by fetch api.

Request/response formatting referes to constructing a request payload and parsing the response payload. A formatter object should implement `pack()` and `unpack()` properties. `pack()` is to construct the request payload and `unpack()` is used to parse the response. Any number of formatters can be added to `apiRequestInstance` using the `addFromatter()` method. E.g. `GetFormatter`, `PostFormatter`, `CorsFormatter`, `FileUploadFormatter`, `GoogleMapsFormatter`, ....

## Examples
* [Basic Example](https://stackblitz.com/edit/1-0-0-api-request?embed=1)


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
    const boundary = 'Boundary-' + Date.now();

    headers.append('Accept', '*/*');
    headers.append('Content-Type', 'multipart/form-data; boundary=' + boundary);

    if (typeof payload !== 'undefined') {
      body.append('arguments', JSON.stringify(payload));
    }

    return {
      method: 'POST',
      headers,
      body,
      mode: 'cors',
      credentails: 'include'
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
