/* eslint-disable */
import {Polyfill} from '@aofl/polyfill-service';

let polyfillsConfig = {};
if (typeof polyfills !== 'undefined') {
  polyfillsConfig = polyfills;
}

window.mochaConfig = {};

window.aofljsConfig = window.aofljsConfig || {};
window.aofljsConfig.unitTesting = {
  ready: true
}
window.aofljsConfig.report = {
  status: 'init',
  pass: true,
  stream: [
    // [
    //   "pass",
    //   {
    //     "title": "Should update to German layout",
    //     "fullTitle": "@aofl/i18n-mixin __() Should update to German layout",
    //     "duration": 2,
    //     "currentRetry": 0
    //   }
    // ],
    // [
    //   "fail",
    //   {
    //     "title": "Should return translations from i18n class",
    //     "fullTitle": "@aofl/i18n-mixin Should return translations from i18n class",
    //     "duration": 6,
    //     "currentRetry": 0,
    //     "err": "expected { 'de-DE': [Function: de-DE] } to equal '[object Object]1'"
    //     "stack": "AssertionError: expected { 'de-DE': [Function: de-DE] } to equal '[object Object]1'\n    at n.<anonymous> (index.spec.js.html:718:3611)\n    at s (index.spec.js.html:178:2724)\n    at Generator._invoke (index.spec.js.html:178:2477)\n    at Generator.forEach.e.<computed> [as next] (index.spec.js.html:178:3081)\n    at t (index.spec.js.html:55:689)\n    at l (index.spec.js.html:55:900)"
    //   }
    // ]
  ],
  // output: '',
  coverage: {}
};

Polyfill.loadAll(polyfillsConfig)
.then(import(/* webpackMode: "eager" */'./mocha'))
.then(import(/* webpackMode: "eager" */'./load-env'))
.then(() => {
  window.aofljsConfig.unitTesting.ready = true;
  window.dispatchEvent(new CustomEvent('AOFL_FRAMEWORK_READY'));
});