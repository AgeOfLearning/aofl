/* eslint-disable */
module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const LIT_ELEMENT_IMPORTS = [];
  const AOFL_IMPORTS = [];

  const LIT_ELEMENT_MODULES = ['LitElement', 'defaultConverter', 'notEqual', 'UpdatingElement', 'query', 'queryAll', 'eventOptions', 'html', 'svg', 'TemplateResult', 'SVGTemplateResult', 'supportsAdoptingStyleSheets', 'CSSResult', 'unsafeCSS', 'css'];

  const aoflElementImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-element',
    },
  });
  aoflElementImport.find(j.ImportSpecifier).forEach((item) => {
    if (LIT_ELEMENT_MODULES.indexOf(item.node.local.name) > -1) {
      LIT_ELEMENT_IMPORTS.push(item.node.local.name);
    } else {
      AOFL_IMPORTS.push(item.node.local.name);
    }
  });

  const litElementImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'lit-element'
    }
  });
  litElementImport.find(j.ImportSpecifier).forEach((item) => {
    if (LIT_ELEMENT_IMPORTS.indexOf(item.node.local.name) === -1) {
      LIT_ELEMENT_IMPORTS.push(item.node.local.name);
    }
  });

  const newLitElementImport = j.importDeclaration([...new Set(LIT_ELEMENT_IMPORTS)].map(((item) => j.importSpecifier(j.identifier(item)))),
    j.literal('lit-element')
  );

  const newAoflImport = j.importDeclaration([...new Set(AOFL_IMPORTS)].map(((item) => j.importSpecifier(j.identifier(item)))),
    j.literal('@aofl/web-components/aofl-element')
  );

  if (aoflElementImport.length > 0) {
    if (LIT_ELEMENT_IMPORTS.length) {
      aoflElementImport.insertAfter(newLitElementImport);
    }
    if (AOFL_IMPORTS.length) {
      aoflElementImport.insertAfter(newAoflImport);
    }
  }

  aoflElementImport.remove();
  litElementImport.remove();

  return root.toSource({quote: 'single', objectCurlySpacing: false});
};
