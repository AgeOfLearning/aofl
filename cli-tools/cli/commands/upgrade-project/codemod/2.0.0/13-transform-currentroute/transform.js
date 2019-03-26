module.exports = (file, api, options) => {
  const {j} = api;

  const root = j(file.source);
  const matchedRoute = root.find(j.MemberExpression, {
    object: {
      name: 'routerInstance'
    },
    property: {
      name: 'matchedRoute'
    }
  });

  const currentRoute = j.memberExpression(
    j.identifier('routerInstance'),
    j.identifier('currentRoute')
  );

  const routerInstance = j.memberExpression(
    currentRoute,
    j.identifier('matchedRoute')
  );

  matchedRoute.replaceWith(routerInstance);

  return root.toSource({quote: 'single', objectCurlySpacing: false});
};
