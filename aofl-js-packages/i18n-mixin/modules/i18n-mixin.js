/**
 * @summary i18n-mixin
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */
import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import {html} from 'lit-element';
import md5 from 'tiny-js-md5';
import {I18n} from '@aofl/i18n';

/**
 * Mixin function for I18nMixin class
 *
 * @memberof module:@aofl/i18n-mixin
 * @param {LitElement} superClass
 */
export default dedupingMixin((superClass) => {
  /**
   * @memberof module:@aofl/i18n-mixin
   * @extends {superClass}
   */
  class I18nMixin extends superClass {
    /**
     *
     */
    constructor(...args) {
      super(...args);
      this.translationMap = {};
      this.i18n = new I18n();
      this.observer = this.langListener();
    }

    /**
     *
     */
    static get properties() {
      return {
        lang: {type: String}
      };
    }

    set translations(value) {
      this.i18n.translations = value;
    }

    get translations() {
      return this.i18n.translations;
    }

    /**
     * Listens for html lang mutations
     * @return {MutationObserver}
     */
    langListener() {
      const observer = new MutationObserver((mutationList) => {
        if (this.getAttribute('lang')) { return; }
        this.i18n.lang = mutationList[0].target.lang;
        this.requestUpdate();
      });
      observer.observe(document.documentElement, {attributes: true});
      return observer;
    }


    /**
     * Check if templateParts matches previously cached template and
     * prevent unnecessary render updates
     *
     * @param {*} id
     * @param {*} templateParts
     * @return {templateParts}
     */
    getCachedTemplate(id, templateParts) {
      if (typeof this.translationMap[id] === 'undefined' ||
      this.translationMap[id].strings[0] !== templateParts.strings[0]) {
        this.translationMap[id] = templateParts;
      }

      return this.translationMap[id];
    }

    /**
     * Language translation function.
     *
     * @param {String} id
     * @param {String} str
     * @return {String}
     */
    async __(id, str) {
      const translated = await this.i18n.__(id, str);
      const templateParts = html([translated]);
      return this.getCachedTemplate(id, templateParts);
    }

    /**
     * Replace function. When invoked it will replace %r(number)% with the number matching the index
     * of the arguments passed to the _r function.
     *
     * @param {String} str
     * @param {*} args
     * @return {String}
     */
    async _r(str, ...args) {
      const translated = await this.i18n._r(str, ...args);

      const templateParts = html([translated]);
      const id = md5(translated);

      return this.getCachedTemplate(id, templateParts);
    }

    /**
     * Conditional translation function. When invoked it finds the correct string based on the labels
     * specified in ...args.
     *
     * @param {*} id
     * @param {*} str
     * @param {*} args
     * @return {String}
     */
    async _c(id, str, ...args) {
      const translated = await this.i18n._c(id, str, ...args);
      const templateParts = html([translated]);
      return this.getCachedTemplate(id, templateParts);
    }

    /**
     * Sets initial lang
     */
    connectedCallback() {
      this.i18n.lang = this.getAttribute('lang') || document.documentElement.getAttribute('lang');
      super.connectedCallback();
    }

    /**
     * Listen for component lang attribute mutataions
     *
     * @memberof I18nMixin
     * @param {String} name
     * @param {String} oldValue
     * @param {String} newValue
     * @return {void}
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'lang') {
        if (!newValue) {
          this.i18n.lang = document.documentElement.lang;
        } else {
          this.i18n.lang = newValue;
        }
        this.requestUpdate();
      }
      super.attributeChangedCallback(name, oldValue, newValue);
    }

    /**
     *
     * @memberof I18nMixin
     * @param {Object} templates
     * @param {*} args
     * @return {Object}
     */
    render(templates, ...args) {
      let template = templates.default;
      if (typeof templates[this.i18n.lang] !== 'undefined') {
        template = templates[this.i18n.lang];
      }

      return super.render(template.template, template.styles, ...args);
    }
    /**
     *
     * @param {*} args
     */
    disconnectedCallback(...args) {
      super.disconnectedCallback(...args);
      this.observer.disconnect();
    }
  }
  return I18nMixin;
});
