const DELIMITER_REGEX = /([A-Z](?=[A-Z][a-z])|[^A-Z_-](?=[A-Z])|[0-9])/g;

const funcs = {
  capitilize(str) {
    if (!str.length) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  camelCase(str) {
    const words = str.replace(DELIMITER_REGEX, '$1 ').split(/\s+|_|-/);

    let camelized = [words[0]];
    if (words.length > 1) {
      camelized = camelized
      .concat(
      words
      .slice(1)
      .map(function capitilizeStr(str) {
        return funcs.capitilize(str);
      }
      ));
    }

    return camelized.join('');
  },
  upperCamelCase(str) {
    return funcs.capitilize(funcs.camelCase(str));
  },
  addDash(str) {
    if (str.indexOf('-') === -1) {
      return str + '-element';
    }
    return str;
  }
};

module.exports = funcs;
