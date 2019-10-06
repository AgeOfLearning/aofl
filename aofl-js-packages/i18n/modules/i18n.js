/**
 * @summary i18n
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */

/**
 * @memberof module:@aofl/i18n
 * @private
 * @type {RegExp}
 */
const REPLACE_REGEX = /%%?r(\d+)(?:%|::.*?%%)/g;
/**
 * @memberof module:@aofl/i18n
 * @private
 * @type {RegExp}
 */
const CONDITIONAL_REPLACE_REGEX = /%c(\d+)%/g;


/**
 * Provides translation capability.
 *
 * @memberof module:@aofl/i18n
 */
class I18n {
  /**
   * Creates an instance of I18n.
   *
   * @param {Object} [translations={}] - translations map
   */
  constructor(translations = {}, lang = 'en-US') {
    this.translations = translations;
    this.lang = lang;
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
    const languageMap = await this.getTranslationMap(this.lang);
    let out = str;

    if (typeof languageMap !== 'undefined' && typeof languageMap[id] === 'object' &&
      typeof languageMap[id].text === 'string') {
      out = languageMap[id].text;
    }

    return out;
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

    return out;
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
    let out = '';
    const languageMap = await this.getTranslationMap(this.lang);

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

    // when language map is not matched we still need to replace %c#% in the default text
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
    return out;
  }
}

export {
  I18n
};
