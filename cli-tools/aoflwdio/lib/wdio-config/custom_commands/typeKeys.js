const MODIFIER_KEYS_REGEX = /((?<!\\)\[[^[\]]*\])/gm; // you can escape \[ but can't escape inside [\[]
const ESCAPE_REGEX = /\\/g;

const typeKeys = function(str) {
  const matches = str.split(MODIFIER_KEYS_REGEX);
  if (browser.capabilities.browserName === 'Safari') {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      if (match.charAt(0) === '[') {
        browser.keys(match.slice(1, match.length - 1));
      } else {
        const keys = match.replace(ESCAPE_REGEX, '').split('');
        for (let j = 0; j < keys.length; j++) {
          browser.keys(keys[j]);
        }
      }
    }
  } else {
    browser.keys(matches);
  }
};

module.exports = typeKeys;
