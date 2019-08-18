const recurseObjectByPath = (obj, path, op) => {
  const pathParts = path === ''? '': path.split('.');

  const recurse = (pathParts, source) => {
    let key = '';
    let subPath = [];
    if (pathParts.length) {
      key = pathParts[0];
      subPath = pathParts.slice(1);
    }
    return op(key, subPath, source, recurse);
  };

  return recurse(pathParts, obj);
};

export {
  recurseObjectByPath
};
