const DocParser = require('doc-parser');

const docRegex = /^\/\*\*[^]*?\*\//;
const reader = new DocParser({
  route: [
    {
      property: 'value',
      parser: 'text',
      optional: false
    }
  ],
  title: [
    {
      property: 'value',
      parser: 'text',
      optional: true
    }
  ],
  locale: [
    {
      property: 'value',
      parser: 'text',
      optional: false
    }
  ],
  metatag: [
    {
      property: 'value',
      parser: 'object',
      optional: true
    }
  ],
  meta: [
    {
      property: 'value',
      parser: 'object',
      optional: true
    }
  ],
  prerender: [
    {
      property: 'value',
      parser: 'boolean',
      optional: true
    }
  ]
});


const parseFile = (content) => {
  const parsedData = {
    route: '',
    title: '',
    metaTags: [],
    mata: {},
    locale: '',
    prerender: false
  };
  const matches = docRegex.exec(content);
  if (matches !== null) {
    const docBlock = matches[0];
    const routeData = reader.parse(docBlock);
    for (let i = 0; i < routeData.body.length; i++) {
      let d = routeData.body[i];
      if (d.kind === 'metatag') {
        parsedData.metaTags.push(d.value);
      } else {
        parsedData[d.kind] = d.value;
      }
    }
  }
  return parsedData;
};

module.exports = parseFile;
