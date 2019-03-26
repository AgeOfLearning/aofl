module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const aoflElementImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-element',
    },
  });

  const newImport = j.importDeclaration([j.importSpecifier(j.identifier('AoflElement'))], j.literal('@aofl/web-components/aofl-element'));
  aoflElementImport.insertAfter(newImport);
  aoflElementImport.remove();

  return root.toSource({quote: 'single', objectCurlySpacing: false});
};
