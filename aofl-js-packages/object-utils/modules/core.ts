type ObjectUtilsRecurse = (pathParts: string[], source: any) => unknown;
type ObjectUtilsCallback = (key: string, pathParts: string[], source: any, recurse: ObjectUtilsRecurse) => unknown;
/**
 * Abstracts away the recursion function of traversing an object's nested
 * properties by a given path.
 *
 * @param obj reference object
 * @param path path to a nested key. Use dot notation. E.g. prop.prop.prop
 * @param op callback function to customize operation when path is reached
 */
const recurseObjectByPath = (obj: any, path: string, op: ObjectUtilsCallback) : any => {
  const pathParts : string[] = (path === '')? []: path.split('.');

  const recurse = (argPathParts: string[], source: any) => {
    let key : string = '';
    let subPath : string[] = [];
    if (argPathParts.length) {
      key = argPathParts[0];
      subPath = argPathParts.slice(1);
    }
    return op(key, subPath, source, recurse);
  };

  return recurse(pathParts, obj);
};

export {
  recurseObjectByPath,
  ObjectUtilsCallback,
  ObjectUtilsRecurse
};
