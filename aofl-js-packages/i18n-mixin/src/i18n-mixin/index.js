import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import {html} from '@polymer/lit-element';
import md5 from 'tiny-js-md5';

const REPLACE_REGEX = /%%?r(\d+)(?:%|::.*?%%)/g;
const CONDITIONAL_REPLACE_REGEX = /%c(\d+)%/g;

/**
 * Mixin function for I18nMixin class
 *
 * @memberof module:aofl-js/i18n-mixin-package
 *
 * @requires tiny-js-md5/md5
 * @requires polymer/dedupingMixin
 */
export default dedupingMixin((superClass) => {
  /**
   * @memberof module:aofl-js/i18n-mixin-package
   */
  class I18nMixin extends superClass {
    /**
     *
     */
    constructor(...args) {
      super(...args);
      this.observer = this.langListener();
      this.translationMap = {};
    }

    /**
     *
     */
    static get properties() {
      return {
        lang: {type: String}
      };
    }

    /**
     * Listens for html lang mutations
     * @return {MutationObserver}
     */
    langListener() {
      const observer = new MutationObserver((mutationList) => {
        if (this.getAttribute('lang')) { return; }
        this.__lang = mutationList[0].target.lang;
        this.requestUpdate();
      });
      observer.observe(document.documentElement, {attributes: true});
      return observer;
    }

    /**
     * Lazy-load the translation map
     *
     * @param {String} lang
     * @return {Promise}
     */
    getTranslationMap(lang) {
      if (typeof this.translations !== 'undefined' && typeof this.translations[lang] === 'function') {
        return this.translations[lang]()
          .then((langModule) => langModule.default);
      }
      return Promise.resolve({});
    }

    /**
     * Language translation function.
     *
     * @param {String} id
     * @param {String} str
     * @return {String}
     */
    async __(id, str) {
      const translation = await this.getTranslationMap(this.__lang);
      const languageMap = translation;
      let out = str;

      if (typeof languageMap !== 'undefined' && typeof languageMap[id] === 'object' &&
      typeof languageMap[id].text === 'string') {
        out = languageMap[id].text;
      }

      const translated = html([out]);
      if (typeof this.translationMap[id] === 'undefined' ||
      this.translationMap[id].strings[0] !== translated.strings[0]) {
        this.translationMap[id] = translated;
      }

      return this.translationMap[id];
    }

    /**
     * Replace function. When invoked it will replace %r(number)% with the number matching the index
     * of the arguments passed to the _r function.
     *
     * @param {String} _str
     * @param {*} args
     * @return {String}
     */
    async _r(_str, ...args) {
      let str = await Promise.resolve(_str);
      /* istanbul ignore else */
      if (typeof str === 'object' && Array.isArray(str.strings) && str.strings.length) {
        str = str.strings[0];
      }

      let matches = REPLACE_REGEX.exec(str);
      let pivot = 0;
      let out = '';

      while (matches !== null) {
        const match = matches[0];
        const argIndex = matches[1] - 1;
        const offset = match.length;

        out += str.slice(pivot, matches.index) + args[argIndex];
        pivot = matches.index + offset;
        matches = REPLACE_REGEX.exec(str);
      }

      out += str.slice(pivot);

      const translated = html([out]);
      const key = md5(out);

      if (typeof this.translationMap[key] === 'undefined' ||
      this.translationMap[key].strings[0] !== translated.strings[0]) {
        this.translationMap[key] = translated;
      }

      return this.translationMap[key];
    }

    /**
     * Conditonal translation function. When invoked it findes the correct string based on the labels
     * specified in ...args.
     *
     * @param {*} _id
     * @param {*} _str
     * @param {*} args
     * @return {String}
     */
    async _c(_id, _str, ...args) {
      let id = _id;
      let out = '';
      let str = _str;
      const translation = await this.getTranslationMap(this.__lang);
      const languageMap = translation;

      /* istanbul ignore else */
      if (typeof languageMap !== 'undefined' && typeof languageMap === 'object') {
        const idParts = [];
        for (let i = 0; i < args.length; i = i + 2) {
          const nextI = i + 1;
          /* istanbul ignore next */
          if (nextI >= args.length) continue;
          let key = args[nextI];

          if (typeof args[i][key] === 'undefined') {
            key = '%other%';
          }

          idParts.push(key);
        }

        id += '-' + idParts.join('^^');
        if (typeof languageMap[id] === 'object' && typeof languageMap[id].text === 'string') {
          str = languageMap[id].text;
        }
      }

      // when langugae map is not matched we still need to replace %c#% in the default text
      let matches = CONDITIONAL_REPLACE_REGEX.exec(str);
      let pivot = 0;

      while (matches !== null) {
        const match = matches[0];
        const argIndex = (matches[1] - 1) * 2;
        let argCountIndex = args[argIndex + 1];
        const offset = match.length;

        if (typeof args[argIndex][argCountIndex] === 'undefined') {
          argCountIndex = '%other%';
        }

        out += str.slice(pivot, matches.index) + args[argIndex][argCountIndex];
        pivot = matches.index + offset;
        matches = CONDITIONAL_REPLACE_REGEX.exec(str);
      }

      out += str.slice(pivot);

      const translated = html([out]);
      if (typeof this.translationMap[id] === 'undefined' ||
      this.translationMap[id].strings[0] !== translated.strings[0]) {
        this.translationMap[id] = translated;
      }

      return this.translationMap[id];
    }

    /**
     * Sets initial lang
     */
    connectedCallback() {
      this.__lang = this.getAttribute('lang') || document.documentElement.getAttribute('lang');
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
          this.__lang = document.documentElement.lang;
        } else {
          this.__lang = newValue;
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
      if (typeof templates[this.__lang] !== 'undefined') {
        template = templates[this.__lang];
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
