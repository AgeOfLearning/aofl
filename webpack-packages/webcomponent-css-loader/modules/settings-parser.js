const DocParser = require('doc-parser');

const docRegex = /^\/\*\*[^]*?\*\//;
const configMap = {
  whitelist: 'whitelist',
  whitelistpatterns: 'whitelistPatterns',
  whitelistpatternschildren: 'whitelistPatternsChildren',
  keyframes: 'keyFrames',
  fontgace: 'fontFace'
};
const regexArr = ['whitelistpatterns', 'whitelistpatternschildren'];

const reader = new DocParser({
  aoflcomponent: [],
  whitelist: [
    {
      property: 'value',
      parser: 'array',
      optional: false
    }
  ],
  whitelistpatterns: [
    {
      property: 'value',
      parser: 'array',
      optional: false
    }
  ],
  whitelistpatternschildren: [
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
  ]
});


const parseFile = (content) => {
  let aoflComponent = false;
  const parsedData = {
    whitelist: [],
    whitelistPatterns: [],
    whitelistPatternsChildren: [],
    keyFrames: true,
    fontFace: true
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
