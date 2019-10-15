/* eslint-disable */
module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const AOFL_IMPORTS = [];

  const aoflElementImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-element',
    },
  });
  aoflElementImport.find(j.ImportSpecifier).forEach((item) => {
    AOFL_IMPORTS.push(item.node.local.name);
  });

  const newAoflImport = j.importDeclaration([...new Set(AOFL_IMPORTS)].map(((item) => j.importSpecifier(j.identifier(item)))),
    j.literal('@aofl/element')
  );

  const aoflDrawerImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-drawer',
    },
  });

  const newDrawerImport = j.importDeclaration([],
    j.literal('@aofl/drawer')
  );

  const aoflImgImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-img',
    },
  });
  const aoflSourceImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-source',
    },
  });
  const aoflPictureImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-picture',
    },
  });

  const newPictureImport = j.importDeclaration([],
    j.literal('@aofl/picture')
  );

  const aoflListOptionImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-list-option',
    },
  });
  const aoflMultiSelectListImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-multiselect-list',
    },
  });
  const aoflSelectListImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@aofl/web-components/aofl-select-list',
    },
  });

  const newSelectImport = j.importDeclaration([],
    j.literal('@aofl/select')
  );

  if (aoflElementImport.length > 0) {
    aoflElementImport.insertAfter(newAoflImport);
  }

  if (aoflDrawerImport.length > 0) {
    aoflDrawerImport.insertAfter(newDrawerImport);
  }

  if (aoflImgImport.length > 0) {
    aoflImgImport.insertAfter(newPictureImport);
  } else if (aoflSourceImport.length > 0) {
    aoflSourceImport.insertAfter(newPictureImport);
  } else if (aoflPictureImport.length > 0) {
    aoflPictureImport.insertAfter(newPictureImport);
  }

  if (aoflListOptionImport.length > 0) {
    aoflListOptionImport.insertAfter(newSelectImport);
  } else if (aoflMultiSelectListImport.length > 0) {
    aoflMultiSelectListImport.insertAfter(newSelectImport);
  } else if (aoflSelectListImport.length > 0) {
    aoflSelectListImport.insertAfter(newSelectImport);
  }

  aoflElementImport.remove();
  aoflDrawerImport.remove();
  aoflImgImport.remove();
  aoflSourceImport.remove();
  aoflPictureImport.remove();
  aoflListOptionImport.remove();
  aoflMultiSelectListImport.remove();
  aoflSelectListImport.remove();

  return root.toSource({quote: 'single', objectCurlySpacing: false});
};
