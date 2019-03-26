module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const routesImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/templating-plugin/routes.config',
    },
  });

  let defaultVarName = 'routesConfig';

  routesImport.find(j.ImportDefaultSpecifier).forEach((item) => {
    defaultVarName = item.node.local.name;
  });

  const newImport = j.importDeclaration([j.importDefaultSpecifier(j.identifier(defaultVarName))], j.literal('./__config/routes'));

  routesImport.insertAfter(newImport);
  routesImport.remove();

  return root.toSource({quote: 'single', objectCurlySpacing: false});
};
