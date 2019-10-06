/**
 * @version 3.0.0
 * @since 1.0.0
 * @module @aofl/uuid
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

/**
 * Generates uuid like random values
 *
 * @memberof module:@aofl/uuid
 * @param {Number} placeholder ommit this argument. It's used internally to generate uuids
 * @return {Number}
 */
const uuid = (placeholder) => {
  if (placeholder) {
    return (placeholder ^ Math.random() * 16 >> placeholder / 4).toString(16);
  }

  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
};

export {uuid};
