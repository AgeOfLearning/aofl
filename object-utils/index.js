export const deepFreeze = (o) => {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach((prop) => {
    if (o.hasOwnProperty(prop) && o[prop] !== null &&
    (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
    !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });

  return o;
};

export const deepAssign = (obj, path, payload) => {
  let pathParts = path.split('.');
  if (path === '') {
    pathParts = [];
  }

  let recursiveAssign = (pathParts, obj) => {
    if (pathParts.length === 0) {
      return Object.assign({}, obj, payload);
    }

    let key = pathParts[0];
    let subPath = pathParts.splice(1);
    return Object.assign({}, _obj, {
      [key]: recursiveAssign(subPath, obj[key])
    });
  };


  return recursiveAssign(pathParts, obj);
};
