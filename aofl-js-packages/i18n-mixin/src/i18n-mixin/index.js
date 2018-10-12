import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import {html} from '@polymer/lit-element';
import md5 from 'tiny-js-md5';

const REPLACE_REGEX = /%%?r(\d+)(?:%|::.*?%%)/g;
const CONDITIONAL_REPLACE_REGEX = /%c(\d+)%/g;

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
      this.langageMap = {};
      this.translationMap = {};
    }

    /**
     * @memberof I18nMixin
     */
    static get properties() {
      return {
        lang: {type: String}
      };
    }


    /**
     * Listens for html lang mutations
     * @memberof I18nMixin
     * @return {void}
     */
    langListener() {
      let observer = new MutationObserver((mutationList) => {
        if (this.getAttribute('lang')) return;
        if (mutationList.length > 0) {
          this.__lang = mutationList[0].target.lang;
          this.requestUpdate();
        }
      });
      observer.observe(document.documentElement, {attributes: true});
      return observer;
    }

    /**
     *
     *
     * @param {*} lang
     * @return {Promise}
     */
    getTranslationMap(lang) {
      if (typeof this.translations[lang] === 'function') {
        return this.translations[lang]();
      } else {
        return Promise.resolve({});
      }
    }

    /**
     * Language translation function.
     *
     * @memberof I18nMixin
     * @param {String} id
     * @param {String} str
     * @param {Object} translations
     * @return {String}
     */
    __(id, str) {
      const languageMap = this.langageMap[this.__lang] || {};
      let out = str;
      if (typeof languageMap !== 'undefined' && typeof languageMap.default === 'object' &&
      typeof languageMap.default[id] === 'object' && typeof languageMap.default[id].text === 'string') {
        out = languageMap.default[id].text;
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
     * @param {*} _str
     * @param {*} args
     * @return {String}
     */
    _r(_str, ...args) {
      let str = _str;
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
    _c(_id, _str, ...args) {
      let id = _id;
      let out = '';
      let str = _str;
      const languageMap = this.langageMap[this.__lang] || {};

      if (typeof languageMap !== 'undefined' && typeof languageMap.default === 'object') {
        let idParts = [];
        for (let i = 0; i < args.length; i = i + 2) {
          const nextI = i + 1;
          if (nextI >= args.length) continue;
          let key = args[nextI];

          if (typeof args[i][key] === 'undefined') {
            key = '%other%';
          }

          idParts.push(key);
        }

        id += '-' + idParts.join('^^');
        if (typeof languageMap.default[id] === 'object' && typeof languageMap.default[id].text === 'string') {
          str = languageMap.default[id].text;
        }
      }

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
     *
     * @memberof I18nMixin
     * @return {void}
     */
    connectedCallback() {
      this.__lang = this.lang || document.documentElement.getAttribute('lang');
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
      super.attributeChangedCallback(name, oldValue, newValue);
      if (name === 'lang') {
        if (!newValue) {
          this.__lang = document.documentElement.lang;
        } else {
          this.__lang = newValue;
        }
      }
    }

    /**
     * @return {Promise}
     */
    async requestUpdate(...args) {
      const translation = await this.getTranslationMap(this.__lang);
      if (typeof this.langageMap[this.__lang] === 'undefined') {
        this.langageMap[this.__lang] = translation.default;
      }
      return super.requestUpdate(...args);
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
     * @memberof I18nMixin
     * @param {*} args
     * @return {void}
     */
    disconnectedCallback(...args) {
      // super.disconnectedCallback(...args);
      this.observer.disconnect();
    }
  }
  return I18nMixin;
});
