/**
 * @summary polyfill
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import promiscuous from '../promiscuous-polyfill';
import webcomponentsLoader from '../webcomponents-loader';

/* istanbul ignore next */
if (typeof window.Promise === 'undefined') {
  window.Promise = promiscuous;
}

/**
 * Used to polyfill missing browser features.
 *
 * @memberof module:@aofl/polyfill-service
 *
 * @example
 * await Polyfill.loadAll({
 *   'fetch': () => import('isomorphic-fetch'),
 *   'Reflect': () => import('harmony-reflect'),
 *   'Array.prototype.find': () => import('array.prototype.find'),
 *   'html-imports': {
 *     test() {
 *       return !('import' in document.createElement('link'));
 *     },
 *     load: () => import('@webcomponents/webcomponentsjs/webcomponents-bundle')
 *   }
 * });
 */
class Polyfill {
  /**
   * test if property is supported by browser/window.
   *
   * @param {String} property dot notation path of a nested window property.
   * @return {Boolean}
   */
  static supported(property) {
    const modulePath = property.split('.');
    let obj = window;
    for (let i = 0; i < modulePath.length; i++) {
      if (typeof obj[modulePath[i]] === 'undefined') { return false; }
      obj = obj[modulePath[i]];
    }
    return true;
  }

  /**
   * load polyfill
   *
   * @param {String} polyfillId id of polyfill to load
   * @param {Object} polyfillConfig polyfills config object
   * @return {Promise}
   */
  static load(polyfillId, polyfillConfig) {
    if (typeof polyfillConfig.load === 'function' && typeof polyfillConfig.test === 'function'
    && !polyfillConfig.test()) {
      return polyfillConfig.load();
    } else if (typeof polyfillConfig === 'function' && !Polyfill.supported(polyfillId)) {
      return polyfillConfig();
    }
    return Promise.resolve();
  }

  /**
   * load all polyfills
   *
   * @param {Object} polyfills polyfills config object
   * @return {Promis}
   */
  static loadAll(polyfills) {
    const promises = [];

    for (const key in polyfills) {
      /* istanbul ignore next */
      if (polyfills.hasOwnProperty(key)) {
        promises.push(Polyfill.load(key, polyfills[key]));
      }
    }

    return Promise.all(promises)
      .then(webcomponentsLoader)
      .then(/* istanbul ignore next */() => {
        document.dispatchEvent(new CustomEvent('WebComponentsReady', {
          bubbles: true
        }));
      });
  }
}

export default Polyfill;
