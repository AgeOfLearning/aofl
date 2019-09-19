/* eslint-disable */
import {Polyfill} from '@aofl/polyfill-service';
import './get-test-container';
import './mocha';
import chai from 'chai';
import 'wct-mocha/wct-mocha';
import sinon from './sinon';

window.chai = chai;
window.expect = chai.expect;
window.should = chai.should;
window.assert = chai.assert;
window.sinon = sinon;

let polyfillsConfig = {};
if (typeof polyfills !== 'undefined') {
  polyfillsConfig = polyfills;
}

Polyfill.loadAll(polyfillsConfig)
.then(async () => {
  const chaiAsPromisedModule = await import('chai-as-promised');
  chai.use(chaiAsPromisedModule.default);
})
.then(() => {
  window.dispatchEvent(new CustomEvent('AOFL_FRAMEWORK_READY'));
});
