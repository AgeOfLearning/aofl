/* istanbul ignore next */
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

 /**
  * @memberof webcomponentsLoader
  */
const scripts = {
  'webcompononts-ce': () => {
    return import('@webcomponents/webcomponentsjs/bundles/webcomponents-ce');
  },
  'webcomponents-sd': () => {
    return import('@webcomponents/webcomponentsjs/bundles/webcomponents-sd');
  },
  'webcomponents-sd-ce': () => {
    return import('@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js');
  },
  'webcomponents-sd-ce-pf': () => {
    return import('@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf');
  }
};

/* istanbul ignore next */
const load = () => {
  return new Promise((resolve, reject) => {
    let polyfillsLoaded = false;
    let whenLoadedFns = [];
    let allowUpgrades = false;
    let flushFn;
    let polyfills = [];

    const fireEvent = () => {
      window.WebComponents.ready = true;
      resolve();
    };

    const batchCustomElements = () => {
      if (window.customElements && customElements.polyfillWrapFlushCallback) {
        customElements.polyfillWrapFlushCallback((flushCallback) => {
          flushFn = flushCallback;
          if (allowUpgrades) {
            flushFn();
          }
        });
      }
    };

    const runWhenLoadedFns = () => {
      allowUpgrades = false;
      let done = function() {
        allowUpgrades = true;
        whenLoadedFns.length = 0;
        flushFn && flushFn();
      };
      return Promise.all(
        whenLoadedFns.map(function(fn) {
          return fn instanceof Function ? fn() : fn;
        })
      )
        .then(function() {
          done();
        })
        .catch(function(err) {
          console.error(err);
        });
    };

    const ready = () => {
      // bootstrap <template> elements before custom elements
      if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
        HTMLTemplateElement.bootstrap(window.document);
      }
      polyfillsLoaded = true;
      runWhenLoadedFns().then(fireEvent);
    };

    const asyncReady = () => {
      batchCustomElements();
      ready();
    };


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
if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) ||
(window.ShadyDOM && window.ShadyDOM.force)) {
  polyfills.push('sd');
}

if (!window.customElements || window.customElements.forcePolyfill) {
  polyfills.push('ce');
}

let needsTemplate = (function() {
  // no real <template> because no `content` property (IE and older browsers)
  let t = document.createElement('template');
  if (!('content' in t)) {
    return true;
  }
  // broken doc fragment (older Edge)
  if (!(t.content.cloneNode() instanceof DocumentFragment)) {
    return true;
  }
  // broken <template> cloning (Edge up to at least version 17)
  let t2 = document.createElement('template');
  t2.content.appendChild(document.createElement('div'));
  t.content.appendChild(t2);
  let clone = t.cloneNode(true);
  return (clone.content.childNodes.length === 0 ||
    clone.content.firstChild.content.childNodes.length === 0);
  })();
  // NOTE: any browser that does not have template or ES6 features
  // must load the full suite of polyfills.
  if (!window.Promise || !Array.from || !window.URL || !window.Symbol || needsTemplate) {
    polyfills = ['sd-ce-pf'];
  }

  if (polyfills.length) {
      const replacement = 'webcomponents-' + polyfills.join('-');
      if (typeof scripts[replacement] === 'function') {
        // if readyState is 'loading', this script is synchronous
        if (document.readyState === 'loading') {
          // make sure custom elements are batched whenever parser gets to the injected script
          scripts[replacement]()
          .then(function() {
            window.WebComponents._batchCustomElements();
            ready();
          })
          .catch(function(e) {
            throw e;
            // throw new Error('Could not load polyfill bundle ' + replacement);
          });
        } else {
          scripts[replacement]()
          .then(function() {
            asyncReady();
          })
          .catch(function(e) {
            throw new Error('Could not load async polyfill bundle ' + replacement);
          });
        }
      }
    } else {
      polyfillsLoaded = true;
      if (document.readyState === 'complete') {
        fireEvent();
      } else {
        // this script may come between DCL and load, so listen for both, and cancel load listener if DCL fires
        window.addEventListener('load', ready);
        window.addEventListener('DOMContentLoaded', function() {
          window.removeEventListener('load', ready);
          ready();
        });
      }
    }
  });
};

/* istanbul ignore next */
export default load;
