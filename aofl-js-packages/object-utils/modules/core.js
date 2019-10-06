const recurseObjectByPath = (obj, path, op) => {
  const pathParts = path === ''? '': path.split('.');

  const recurse = (argPathParts, source) => {
    let key = '';
    let subPath = [];
    if (argPathParts.length) {
      key = argPathParts[0];
      subPath = argPathParts.slice(1);
    }
    return op(key, subPath, source, recurse);
  };

  return recurse(pathParts, obj);
};

export {
  recurseObjectByPath
};
