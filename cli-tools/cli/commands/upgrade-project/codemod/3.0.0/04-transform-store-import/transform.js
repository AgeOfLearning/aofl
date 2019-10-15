module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const imports = [];


  const legacyStoreImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/store'
    }
  });
  legacyStoreImport.find(j.ImportSpecifier).forEach((item) => {
    imports.push(item.node.local.name);
  });


  const newImport = j.importDeclaration([...new Set(imports)].map(((item) => j.importSpecifier(j.identifier(item)))),
    j.literal('@aofl/store/dist/legacy')
  );

  if (legacyStoreImport.length > 0) {
    legacyStoreImport.insertAfter(newImport);
  }

  legacyStoreImport.remove();

  return root.toSource({quote: 'single', objectCurlySpacing: false});
};
