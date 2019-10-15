/* eslint-disable */
module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const litHtmlImports = [];
  const aoflImports = [];

  const litHtmlModules = ['render', 'html'];

  const aoflElementImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-element',
    },
  });
  aoflElementImport.find(j.ImportSpecifier).forEach((item) => {
    if (litHtmlModules.indexOf(item.node.local.name) > -1) {
      litHtmlImports.push(item.node.local.name);
    } else {
      aoflImports.push(item.node.local.name);
    }
  });

  const litHtmlImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'lit-html'
    }
  });
  litHtmlImport.find(j.ImportSpecifier).forEach((item) => {
    if (litHtmlImports.indexOf(item.node.local.name) === -1) {
      litHtmlImports.push(item.node.local.name);
    }
  });

  const newLitHtmlImport = j.importDeclaration([...new Set(litHtmlImports)].map(((item) => j.importSpecifier(j.identifier(item)))),
    j.literal('lit-html')
  );

  const newAoflImport = j.importDeclaration([...new Set(aoflImports)].map(((item) => j.importSpecifier(j.identifier(item)))),
    j.literal('@aofl/web-components/aofl-element')
  );

  if (aoflElementImport.length > 0) {
    if (litHtmlImports.length) {
      aoflElementImport.insertAfter(newLitHtmlImport);
    }
    if (aoflImports.length) {
      aoflElementImport.insertAfter(newAoflImport);
    }
  }

  aoflElementImport.remove();
  litHtmlImport.remove();

  return root.toSource({quote: 'single', objectCurlySpacing: false});
};
