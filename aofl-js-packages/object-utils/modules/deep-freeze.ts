/**
 * Recursively calls Object.freeze on objects properties
 *
 * @param source reference to object
 */
export function deepFreeze(source: any) : any {
  Object.freeze(source);

  for (const key in source) {
    if (Object.hasOwnProperty.call(source, key) && source[key] !== null &&
    (typeof source[key] === 'object' || typeof source[key] === 'function') &&
    !Object.isFrozen(source[key])) {
      deepFreeze(source[key]);
    }
  }

  return source;
}
