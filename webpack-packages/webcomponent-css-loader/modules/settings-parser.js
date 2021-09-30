const DocParser = require('doc-parser');

const docRegex = /^\/\*\*[^]*?\*\//;
const configMap = {
  fontface: 'fontFace',
  keyframes: 'keyframes',
  variables: 'variables',
  safelist: 'safelist',
  blocklist: 'blocklist',
};
const regexArr = ['blocklist', 'safelist'];

const reader = new DocParser({
  aoflcomponent: [],
  safelist: [
    {
      property: 'value',
      parser: 'array',
      optional: false
    }
  ],
  blocklist: [
    {
      property: 'value',
      parser: 'array',
      optional: false
    }
  ],
  keyframes: [
    {
      property: 'value',
      parser: 'boolean',
      optional: false
    }
  ],
  fontface: [
    {
      property: 'value',
      parser: 'boolean',
      optional: false
    }
  ],
  variables: [
    {
      property: 'value',
      parser: 'boolean',
      optional: false
    }
  ]
});


const parseFile = (content) => {
  let aoflComponent = false;
  const parsedData = {
    safelist: [':host'],
    blocklist: [],
    keyframes: true,
    fontFace: true,
    variables: true
  };
  const matches = docRegex.exec(content);
  if (matches !== null) {
    const docBlock = matches[0];
    const purgeCssConfig = reader.parse(docBlock);

    for (let i = 0; i < purgeCssConfig.body.length; i++) {
      const d = purgeCssConfig.body[i];
      if (d.kind === 'aoflcomponent') {
        aoflComponent = true;
      } else if (regexArr.indexOf(d.kind) > -1) {
        for (let i = 0; i < d.value.length; i++) {
          parsedData[configMap[d.kind]].push(new RegExp(d.value[i]));
        }
      } else {
        parsedData[configMap[d.kind]] = d.value;
      }
    }
  }

  if (!aoflComponent) return null;
  return parsedData;
};

module.exports = parseFile;
