module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const routerInstance = root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'routerInstance'
      },
      property: {
        name: 'navigate'
      }
    }
  });

  routerInstance.forEach((ri) => {
    const props = [];
    ri.value.arguments.forEach((arg, index) => {
      if (index > 0) {
        if (arg.type === 'Literal') {
          if (arg.raw === 'true') {
            if (index === 1) {
              props.push(j.property('init', j.identifier('forceReload'), j.literal(true)));
            }
            if (index === 2) {
              props.push(j.property('init', j.identifier('poppedState'), j.literal(true)));
            }
          }
        } else if (index === 3 && arg.type === 'ObjectExpression') {
          arg.properties.forEach((item) => props.push(item));
        }
      }
    });

    ri.value.arguments = [ri.value.arguments[0], j.objectExpression(props)];
  });

  return root.toSource({quote: 'auto', objectCurlySpacing: false});
};
