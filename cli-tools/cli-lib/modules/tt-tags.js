const {v4: uuidv4} = require('uuid');
const uniki = require('uniki');

const translationRegex = /(\._[_c]\()[^`'"{]*[`'"{)](?!<tt-.*?>)/g;

class TtTag {
  static addIds(str) {
    let matches = translationRegex.exec(str);
    let pivot = 0;
    let out = '';

    while (matches !== null) {
      const ttTag = `'<tt-${uniki(uuidv4())}>', `;
      const matchGroup = matches[1];
      const offset = matchGroup.length;

      out += str.slice(pivot, matches.index + offset) + ttTag;

      pivot = matches.index + offset;
      matches = translationRegex.exec(str);
    }

    out += str.slice(pivot);
    return out;
  }
}

module.exports.TtTag = TtTag;
