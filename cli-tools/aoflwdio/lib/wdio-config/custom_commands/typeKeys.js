const typeKeys = function(argValue) {
  const MODIFIER_KEYS_REGEX = /(\[[^\]]+\])/gm;
  const splitArg = argValue.split(MODIFIER_KEYS_REGEX);
  const newArr = splitArg.map((item) => {
    if (MODIFIER_KEYS_REGEX.exec(item) !== null) {
      return item.replace('[', '').replace(']', '');
    } else {
      return item.split('');
    }
  });
  const flattenedArr = newArr.flat();
  return flattenedArr.forEach(item => this.keys(item));
};

module.exports = typeKeys;