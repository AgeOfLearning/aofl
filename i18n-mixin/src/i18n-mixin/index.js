import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import md5 from 'tiny-js-md5';

/**
 * @description Mixin function for I18nMixin class
 */
export default dedupingMixin((superClass) => {
  /**
   * @class I18nMixin
   * @extends superClass
   */
   class I18nMixin extends superClass {
    /**
     * @memberof I18nMixin
     */
    constructor(...args) {
      super(...args);
      this.observer = this.langListener();
    }

    /**
     * @memberof I18nMixin
     */
    static get properties() {
      return {
        lang: String
      };
    }
    /**
     * Listens for html lang mutations
     * @memberof I18nMixin
     * @return {void}
     */
    langListener() {
      let observer = new MutationObserver((mutationList) => {
        for (let i = 0; i < mutationList.length; i++) {
          // Only update if the component does not have a lang attr value
          if (this.lang === '') {
            this.__lang = mutationList[i].target.lang;
            this.requestRender();
          }
          break;
        }
      });
      observer.observe(document.documentElement, {attributes: true});
      return observer;
    }

    /**
     * Listen for component lang attribute mutataions
     * @memberof I18nMixin
     * @param {String} name
     * @param {String} oldValue
     * @param {String} newValue
     * @return {void}
     */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (name === 'lang') {
        if (!newValue) {
          this.__lang = document.documentElement.lang;
        } else {
          this.__lang = newValue;
        }
        this.requestRender();
      }
    }

    /**
     *
     * @memberof I18nMixin
     * @param {Object} templates
     * @param {*} args
     * @return {Object}
     */
    _render(templates, ...args) {
      let template = templates.default;
      if (typeof templates[this.__lang] !== 'undefined') {
        template = templates[this.__lang];
      }
      return super._render(template.template, template.styles, ...args);
    }

    /**
     *
     * @memberof I18nMixin
     * @param {String} s
     * @param {String|Number} contexts
     * @return {String}
     */
    printf(s, ...contexts) {
      if (contexts.length === 0) return s;
      return s.replace(/%s(\d)/g, (matches, p1) => {
        return contexts[Number(p1)-1];
      });
    }

    /**
     * Language translation function
     * @memberof I18nMixin
     * @param {String} s
     * @param {Object} langMap
     * @return {String}
     */
    __(s, ...contexts) {
      let key = md5(s);
      if (!this.langMap[key] || !this.langMap[key][this.__lang]) {
        return this.printf(s, ...contexts);
      } else {
        return this.printf(this.langMap[key][this.__lang], ...contexts);
      }
    }

    /**
     *
     * Plural supported language function
     * @param {Object} variants
     * @param {Number} count
     * @param {*} contexts
     * @return {String}
     */
    _n(variants, count, ...contexts) {
      if (typeof variants[count] !== 'undefined') {
        return this.__(variants[count], ...contexts);
      } else {
        throw new Error('Invalid count variable provided to _n() method', variants);
      }
    }

    /**
     * Sets initial lang
     * @memberof I18nMixin
     * @return {void}
     */
    connectedCallback() {
      this.__lang = this.lang || document.documentElement.getAttribute('lang');
      super.connectedCallback();
    }

    /**
     *
     * @memberof I18nMixin
     * @param {*} args
     * @return {void}
     */
    disconnectedCallback(...args) {
      super.disconnectedCallback(...args);
      this.observer.disconnect();
    }
  }
  return I18nMixin;
});
