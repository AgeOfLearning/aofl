const path = require('path');
const esprima = require('esprima');
const fs = require('fs');
const glob = require('fast-glob');
// const chalk = require('chalk');
const addTtTags = require('../tt-tags');

const STRIP_QUOTE_REGEX = /^\(?['`"](.*)['`"]\)?$/;
// const REPLACE_REGEX = /%r(\d+)%/g;
// const CONDITIONAL_REPLACE_REGEX = /%c(\d+)%/g;
let translationCalls = {};
let rCallCount = 0;

const stripQuotes = (str) => {
  return str.replace(STRIP_QUOTE_REGEX, '$1');
};

const getBlockCounter = (punctuator) => {
  const inc = ['(', '{'];
  const dec = [')', '}'];

  if (inc.indexOf(punctuator) > -1) {
    return 1;
  } else if (dec.indexOf(punctuator) > -1) {
    return -1;
  }

  return 0;
};


/**
 *
 *
 * @param {*} tokens
 * @return {Object}
 */
function parseParamAsObject(tokens) {
  let blockCount = 1;
  let param = '';
  let key = '';
  const params = {};

  do {
    const token = tokens.pop();
    if (typeof parseResult === 'undefined') {
      const parseResult = parseSupportedIdentifiers(tokens, token);
      if (typeof parseResult !== 'undefined' && parseResult.method === '_r') {
        params[key] = {target: parseResult.id};
        param = '';
        continue;
      }
    }

    if (token.type === 'Punctuator') {
      blockCount += getBlockCounter(token.value);
      if (token.value === ':') {
        key = stripQuotes(param);
        params[key] = '';
        param = '';
        continue;
      } else if ((token.value === ',' && blockCount === 1) || (token.value === '}' && blockCount === 0)) {
        params[key] = stripQuotes(param);
        param = '';
        continue;
      }
    }

    param += token.value;
  } while (blockCount > 0);

  return params;
}

const addCallToMap = (callObject) => {
  if (typeof translationCalls[callObject.id] !== 'undefined') {
    throw new Error(`${callObject.id} already exsits`);
  }
  translationCalls[callObject.id] = callObject;
};

const supportedIdentifiers = {
  __(tokens) {
    let parseResult = void 0;
    let blockCount = 0;
    let param = '';
    const params = [];
    do {
      const token = tokens.pop();
      if (typeof parseResult === 'undefined') {
        parseResult = parseSupportedIdentifiers(tokens, token);
        if (typeof parseResult !== 'undefined' && parseResult.method === '_r') {
          param = {target: parseResult.id};
          continue;
        }
      }

      if (token.type === 'Punctuator') {
        blockCount += getBlockCounter(token.value);
        if ([',', ')'].indexOf(token.value) === -1 && blockCount > 0) {
          param += token.value;
        }

        if ((token.value === ',' && blockCount === 1) || (token.value === ')' && blockCount === 0)) {
          if (typeof param === 'string') {
            param = stripQuotes(param);
          }
          params.push(param);
          param = '';
        }
      } else if (['String', 'Template', 'Numeric'].indexOf(token.type) > -1) {
        param += token.value;
      }
    } while (blockCount > 0);

    const callObject = {
      id: params[0],
      method: '__',
      params
    };


    addCallToMap(callObject);
    return callObject;
  },
  _c(tokens) {
    let parseResult = void 0;
    let blockCount = 0;
    let param = '';
    const params = [];
    do {
      const token = tokens.pop();
      if (typeof parseResult === 'undefined') {
        parseResult = parseSupportedIdentifiers(tokens, token);
        if (typeof parseResult !== 'undefined' && parseResult.method === '_r') {
          param = {target: parseResult.id};
          continue;
        }
      }

      if (token.type === 'Punctuator') {
        if (blockCount > 0 && token.value === '{') {
          param = parseParamAsObject(tokens);
          continue;
        }
        blockCount += getBlockCounter(token.value);

        if ([',', ')'].indexOf(token.value) === -1 && blockCount > 0) {
          param += token.value;
        }

        if ((token.value === ',' && blockCount === 1) || (token.value === ')' && blockCount === 0)) {
          if (typeof param === 'string') {
            param = stripQuotes(param);
          }
          params.push(param);
          param = '';
        }
      } else if (['String', 'Template', 'Numeric', 'Identifier'].indexOf(token.type) > -1) {
        param += token.value;
      }
    } while (blockCount > 0);

    const callObject = {
      id: params[0],
      method: '_c',
      params
    };

    addCallToMap(callObject);
    return callObject;
  },
  _r(tokens) {
    let parseResult = void 0;
    let blockCount = 0;
    let param = '';
    const params = [];
    do {
      const token = tokens.pop();
      if (typeof parseResult === 'undefined') {
        parseResult = parseSupportedIdentifiers(tokens, token);
        if (typeof parseResult !== 'undefined') {
          param = {target: parseResult.id};
          continue;
        }
      }
      if (token.type === 'Punctuator') {
        blockCount += getBlockCounter(token.value);
        if ([',', ')'].indexOf(token.value) === -1 && blockCount > 0) {
          param += token.value;
        }

        if ((token.value === ',' && blockCount === 1) || (token.value === ')' && blockCount === 0)) {
          if (typeof param === 'string') {
            param = stripQuotes(param);
          }
          params.push(param);
          param = '';
        }
      } else if (['String', 'Template', 'Numeric', 'Identifier'].indexOf(token.type) > -1) {
        param += token.value;
      }
    } while (blockCount > 0);

    const callObject = {
      id: '_r-' + rCallCount,
      method: '_r',
      params
    };

    addCallToMap(callObject);
    rCallCount++;
    return callObject;
  }
};


/**
 * @param {*} tokens
 * @param {*} token
 * @return {*}
 */
function parseSupportedIdentifiers(tokens, token) {
  if (tokens.length <= 1) return;

  if (token.type === 'Identifier') {
    if (typeof supportedIdentifiers[token.value] === 'function' && tokens[tokens.length -1].value === '(') {
      return supportedIdentifiers[token.value](tokens);
    }
  }
}

const parse = (tokens) => {
  while (tokens.length) {
    const token = tokens.pop();
    parseSupportedIdentifiers(tokens, token);
  }
};

const getTranslationCalls = (i18nDir, includePatterns, ignorePatterns) => {
  translationCalls = {};
  rCallCount = 0;

  const baseDir = path.resolve(path.dirname(i18nDir));
  const i18nSkip = [];

  const files = glob.sync([...includePatterns, '**/i18n/'], {
    cwd: baseDir,
    onlyFiles: false,
    ignore: [
      ...ignorePatterns,
      'i18n/'
    ]
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const index = file.indexOf(path.sep + 'i18n');
    if (index > -1) {
      i18nSkip.push(path.join(baseDir, file.slice(0, index)));
    }
  }

  for (let i = 0; i < files.length; i++) {
    if (i18nSkip.some((item) => path.join(baseDir, files[i]).indexOf(item) > -1)) continue;
    const sourcePath = path.resolve(baseDir, files[i]);
    const source = fs.readFileSync(sourcePath, {encoding: 'utf-8'});
    const ttSource = addTtTags(source);

    if (ttSource !== source) {
      fs.writeFileSync(sourcePath, ttSource, {encoding: 'utf-8'});
    }

    const tokens = esprima.tokenize(ttSource, {tolerant: true}).reverse();
    parse(tokens);
  }

  return translationCalls;
};

module.exports = getTranslationCalls;
