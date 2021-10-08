const ts = require('typescript');

const getMixinClasses = (node) => {
  const classes = [];
  if (ts.isCallExpression(node)) {
    classes.push(node.expression.escapedText);
    node.arguments.forEach((argNode) => {
      classes.push(...getMixinClasses(argNode));
    });
  } else if (ts.isIdentifier(node)) {
    classes.push(node.escapedText);
  }


  return [...new Set(classes)];
};

const parseClass = (source, filename) => {
  const items = [];
  const sc = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);

  ts.forEachChild(sc, (node) => {
    if (ts.isClassDeclaration(node)) {
      const item = {
        className: node.name.escapedText,
        heritageClasses: [],
        decorators: []
      };
      if (typeof node.heritageClauses !== 'undefined') {
        // console.log('hc', node.heritageClauses);
        node.heritageClauses.forEach((hcNode) => {
          // console.log('hcNodes', hcNodes);
          hcNode.types.forEach((htcNode) => {
            // console.log('htcNodes', htcNode);
            // console.log(htcNode.expression.kind);
            if (ts.isIdentifier(htcNode.expression)) {
              item.heritageClasses.push(htcNode.expression.escapedText);
            } else if (ts.isCallExpression(htcNode.expression)) {
              // console.log('callexpression');
              // console.log('chNode', chNode.expression.escapedText);
              item.heritageClasses.push(...getMixinClasses(htcNode.expression));
            }
          });
        });
      }
      // console.log('name', node.name.escapedText);

      if (typeof node.decorators !== 'undefined') {
        node.decorators.forEach((value, index) => { // get decorators
          // console.log('deco', index, value);
          value.forEachChild((chNode) => {
            // console.log('chNode', chNode.expression.escapedText);
            item.decorators.push(chNode.expression.escapedText);
          });
        });
      }

      items.push(item);
    }
  });
  return items;
};

module.exports.parseClass = parseClass;
