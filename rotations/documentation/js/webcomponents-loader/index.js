/* eslint-disable */
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import {Polyfill} from '@aofl/polyfill-service';
import polyfills from '../__config/polyfills';

const polyfill = new Polyfill(polyfills);
const polyfillsReady = polyfill.loadAll();

(function() {
  'use strict';

  /**
   * Basic flow of the loader process
   *
   * There are 4 flows the loader can take when booting up
   *
   * - Synchronous script, no polyfills needed
   *   - wait for `DOMContentLoaded`
   *   - run callbacks passed to `waitFor`
   *   - fire WCR event
   *
   * - Synchronous script, polyfills needed
   *   - document.write the polyfill bundle
   *   - wait on the `load` event of the bundle to batch Custom Element upgrades
   *   - wait for `DOMContentLoaded`
   *   - run callbacks passed to `waitFor`
   *   - fire WCR event
   *
   * - Asynchronous script, no polyfills needed
   *   - fire WCR event, as there could not be any callbacks passed to `waitFor`
   *
   * - Asynchronous script, polyfills needed
   *   - Append the polyfill bundle script
   *   - wait for `load` event of the bundle
   *   - batch Custom Element Upgrades
   *   - run callbacks pass to `waitFor`
   *   - fire WCR event
   */

  var polyfillsLoaded = false;
  var whenLoadedFns = [];
  var allowUpgrades = false;
  var flushFn;
  var scripts = {
    'webcompononts-ce': function() {
      return import('@webcomponents/webcomponentsjs/bundles/webcomponents-ce');
    },
    'webcomponents-sd': function() {
      return import('@webcomponents/webcomponentsjs/bundles/webcomponents-sd');
    },
    'webcomponents-sd-ce': function() {
      return import('@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce');
    },
    'webcomponents-sd-ce-pf': function () {
      return import('@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf');
    }
  }

  function fireEvent() {
    window.WebComponents.ready = true;
    let event = document.createEvent('Event');
    event.initEvent('WebComponentsReady', true, false);
    document.dispatchEvent(event);
  }

  function batchCustomElements() {
    if (window.customElements && customElements.polyfillWrapFlushCallback) {
      customElements.polyfillWrapFlushCallback(function (flushCallback) {
        flushFn = flushCallback;
        if (allowUpgrades) {
          flushFn();
        }
      });
    }
  }

  function asyncReady() {
    batchCustomElements();
    ready();
  }

  function ready() {
    // bootstrap <template> elements before custom elements
    if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
      HTMLTemplateElement.bootstrap(window.document);
    }
    polyfillsLoaded = true;
    runWhenLoadedFns().then(() => {
      return fireEvent();
    });
  }

  function runWhenLoadedFns() {
    allowUpgrades = false;
    var done = function() {
      allowUpgrades = true;
      whenLoadedFns.length = 0;
      flushFn && flushFn();
    };
    return Promise.all(whenLoadedFns.map(function(fn) {
      return fn instanceof Function ? fn() : fn;
    })).then(function() {
      done();
    }).catch(function(err) {
      console.error(err);
    });
  }

  window.WebComponents = window.WebComponents || {
    ready: false,
    _batchCustomElements: batchCustomElements,
    waitFor: function(waitFn) {
      if (!waitFn) {
        return;
      }
      whenLoadedFns.push(waitFn);
      if (polyfillsLoaded) {
        runWhenLoadedFns();
      }
    }
  };

  var name = 'webcomponents-loader.js';
  // Feature detect which polyfill needs to be imported.
  var polyfills = [];
  if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) ||
    (window.ShadyDOM && window.ShadyDOM.force)) {
    polyfills.push('sd');
  }
  if (!window.customElements || window.customElements.forcePolyfill) {
    polyfills.push('ce');
  }

  var needsTemplate = (function() {
    // no real <template> because no `content` property (IE and older browsers)
    var t = document.createElement('template');
    if (!('content' in t)) {
      return true;
    }
    // broken doc fragment (older Edge)
    if (!(t.content.cloneNode() instanceof DocumentFragment)) {
      return true;
    }
    // broken <template> cloning (Edge up to at least version 17)
    var t2 = document.createElement('template');
    t2.content.appendChild(document.createElement('div'));
    t.content.appendChild(t2);
    var clone = t.cloneNode(true);
    return (clone.content.childNodes.length === 0 ||
        clone.content.firstChild.content.childNodes.length === 0);
  })();

  // NOTE: any browser that does not have template or ES6 features
  // must load the full suite of polyfills.
  if (!window.Promise || !Array.from || !window.URL || !window.Symbol || needsTemplate) {
    polyfills = ['sd-ce-pf'];
  }

  if (polyfills.length) {
    // Load it from the right place.
    var replacement = 'webcomponents-' + polyfills.join('-');
    if (typeof scripts[replacement] === 'function') {
          // if readyState is 'loading', this script is synchronous
      if (document.readyState === 'loading') {
        // make sure custom elements are batched whenever parser gets to the injected script
        polyfillsReady
        .then(scripts[replacement])
        .then(function() {
          window.WebComponents._batchCustomElements();
          ready();
        });
      } else {
        polyfillsReady
        .then(scripts[replacement])
        .then(function() {
          asyncReady();
        })
        .catch(function() {
          // console.log('caught');
          throw new Error('Could not load polyfill bundle' + replacement);
        });
      }
    }
  } else {
    polyfillsReady
    .then(() => {
      polyfillsLoaded = true;
      if (document.readyState === 'complete') {
        fireEvent()
      } else {
        // this script may come between DCL and load, so listen for both, and cancel load listener if DCL fires
        window.addEventListener('load', ready);
        window.addEventListener('DOMContentLoaded', function() {
          window.removeEventListener('load', ready);
          ready();
        })
      }
    });
  }
})();
