# @aofl/resource-enumerate

Resource enumerate is a special case API call that returns the interface of the API code in a single endpoint. The response can contain server time, paths to resources, and other information based on application needs. An advantage of this technique is that it eliminates the need to hardcode paths/urls.

`@aofl/resource-enumerate` accepts a config object that defines the path to the production api server.

It also supports `before()` and `after()` hooks. See example below.

[Api Documentation](https://ageoflearning.github.io/aofl/v3.x/api-docs/module-@aofl_resource-enumerate.html)

## Installation
```bash
npm i -S @aofl/resource-enumerate
```

## Usage
```javascript
const resourceEnumerateConfig = {
  apis: {
    'awesome-apis': { // api namespace
      url: '/apis/v1.0/resource-enumerate.json', // production url
      requestOptions: { // options passed into fetch
        method: 'GET',
        cache: 'no-cache'
      },
      developmentVariables() { // return an object that is passed into the develpomentConfig function
        return {
          host: location.host
        };
      },
      stageVariables() { // return an object that is passed into the stageConfig function
        return {
          host: location.host
        };
      },
      invalidateCache() { // This function is invoked before each get() call and it controls whether or not a cached version is returned
        return false;
      }
    }
  },
  developmentConfig: () => import('./dev-api-config'), // lazy-load dev config
  stageConfig: () => import('./stage-api-config') // lazy-load stage config
};

export default resourceEnumerateConfig;
```

`[development|stage]Config()` export a function that takes api namespace and the returned object from `[development|stage]Variables()` and returns the path to the environment specific resource enumerate api call.

```javascript
// dev-api-config.js
export default (apiNs, {host}) => {
  return `//${host}/apis/dev/v1.0/resource-enumerate.json`;
};
```

```javascript
// stage-api-config.js
export default (apiNs, {host}) => {
  return `//${host}/apis/stage/v1.0/resource-enumerate.json`;
};
```

```javascript
import {ResourceEnumerate} from '@aofl/resource-enumerate';
import resourceEnumerateConfig from './__config/resource-enumerate-config';
import apiRequestInstance from 'apiRequestInstanceFile :)'; // see @aofl/api-request
import {getServerEnvironment} from '@aofl/server-environment';


const developmentRegex = /localhost|192\.168\.[\d|\.]+|172\.(1[6-9]|2[0-9]|3[01])\.[\d|\.]+|10\.([0-9]|[1-8][0-9]|9[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.[\d|\.]+/; // localhost or all private ips
const stageRegex = /^stage\./; // match url starting with "stage."

const environment = getServerEnvironment(developmentRegex, stageRegex);
const resourceEnumerate = new ResourceEnumerate(environment);
const serverTime = {};

resourceEnumerate.before((request, response, next) => {
  serverTime[request.namespace] = {
    before: Date.now() // record time right before api call
  };
  next(response);
});

resourceEnumerate.after((request, response, next) => {
  serverTime[request.namespace].after = Date.now(); // record end time immediately after the response comes back
  serverTime[request.namespace].delta = response.serverTime - Math.round(
    (servertime[request.namespace].before + servertime[request.namespace].after) / 2); // aproximate difference between server and local client time

  next(response);
});

// making api call
resourceEnumerate.init(resourceEnumerateConfig)
.then(() => {
  resourceEnumerate.get('awesome-apis')
  .then((resourceEnumeratePayload) => {
    apiRequestInstance
    .request(resourceEnumeratePayload.api_url + resourceEnumeratePayload.endpoints.getPosts)
    .then((response) => {
      // do something with response
    });
  });
});
```

## Caching
Calling `get()` will cache the api response by default. There are 2 ways to invalidate cache and fetch a new copy of the resource enumerate data.

1. By calling `get()` and passing `false` as the second argument (`fromCache`).
1. By implementing `invalidateCache()` in the config object. This function is invoked everytime `get()` is invoked and will return the cached data if it evaluates to `false`.

```javascript
...
'awesome-apis': {
  url: '/apis/v1.0/resource-enumerate.json'
  invalidateCache() { // add invalidateCache function
    return Math.random() > 0.8;
  }
}
...
```
