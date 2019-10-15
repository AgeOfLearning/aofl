/* eslint-disable */
module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const imports = [];
  const aoflElementImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-element',
    },
  });
  aoflElementImport.find(j.ImportSpecifier).forEach((item) => {
    imports.push(item.node.local.name);
  });

  const litHtmlImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'lit-html'
    }
  });

  litHtmlImport.find(j.ImportSpecifier).forEach((item) => {
    imports.push(item.node.local.name);
  });

  const litElementImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'lit-element'
    }
  });
  litElementImport.find(j.ImportSpecifier).forEach((item) => {
    imports.push(item.node.local.name);
  });

  const polymerLitElementImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@polymer/lit-element'
    }
  });
  polymerLitElementImport.find(j.ImportSpecifier).forEach((item) => {
    imports.push(item.node.local.name);
  });


  const newImport = j.importDeclaration(
    [
      ...new Set(imports)
    ].map((item => j.importSpecifier(j.identifier(item)))),
    j.literal('@aofl/web-components/aofl-element')
  );

  if (aoflElementImport.length > 0) {
    aoflElementImport.insertAfter(newImport);
  } else if (litHtmlImport.length > 0) {
    litHtmlImport.insertAfter(newImport);
  } else if (litElementImport.length > 0) {
    litElementImport.insertAfter(newImport);
  } else if (polymerLitElementImport.length > 0) {
    polymerLitElementImport.insertAfter(newImport);
  }

  aoflElementImport.remove();
  litHtmlImport.remove();
  litElementImport.remove();
  polymerLitElementImport.remove();

  return root.toSource({quote: 'single', objectCurlySpacing: false});
};
