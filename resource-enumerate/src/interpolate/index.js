const START_SYMBOL = '\{';
const END_SYMBOL = '\}';

export default (template = '', map = {}) => {
  return Object.keys(map)
  .reduce(function(template, key) {
    let regexStr = START_SYMBOL + key + END_SYMBOL;
    let regex = new RegExp(regexStr, 'g');
    return template.replace(regex, map[key]);
  }, template);
};
