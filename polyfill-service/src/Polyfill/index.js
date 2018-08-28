/**
 * Implements Polyfill class which can be used to ployfill missing browser featurs.
 * @summary polyfill
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import promiscuous from '../promiscuous-polyfill';
import webcomponentsLoader from '../webcomponents-loader';

if (typeof window.Promise === 'undefined') {
  window.Promise = promiscuous;
}

/**
 * polyfill service
 */
class Polyfill {
  /**
   * test if property is supported by browser/window.
   *
   * @param {String} property dot notation path of a nested window property.
   * @return {Boolean}
   */
  static supported(property) {
    let modulePath = property.split('.');
    let obj = window;
    for (let i = 0; i < modulePath.length; i++) {
      if (typeof obj[modulePath[i]] === 'undefined') return false;
      obj = obj[modulePath[i]];
    }
    return true;
  }

  /**
   * load polyfill
   *
   * @param {String} polyfillId id of polyfill to load
   * @param {Object} polyfills polyfills config object
   * @return {Promise}
   */
  static load(polyfillId, polyfills) {
    if (!Polyfill.supported(polyfillId) && polyfills.hasOwnProperty(polyfillId)) {
      return polyfills[polyfillId]();
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
    let promises = [];

    for (let key in polyfills) {
      if (polyfills.hasOwnProperty(key)) {
        promises.push(Polyfill.load(key));
      }
    }

    return Promise.all(promises)
    .then(webcomponentsLoader)
    .then(() => {
      document.dispatchEvent(new CustomEvent('WebComponentsReady', {
        bubbles: true
      }));
    });
  }
};

export default Polyfill;
