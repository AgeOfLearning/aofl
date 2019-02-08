/**
 * Finds parent based on the validity of the `cb` function
 *
 * @param {HTMLElement} node
 * @param {*} cb
 * @memberof module:aofl-js/component-utils-package
 * @return {Object}
 */
const traverseParents = (node, cb) => {
  let parent = node;

  while (parent !== null) {
    if (parent.assignedSlot) {
      parent = parent.assignedSlot;
    } else if (typeof parent.tagName === 'undefined' && typeof parent.host !== 'undefined') {
      parent = parent.host;
    } else if (parent.parentNode) {
      parent = parent.parentNode;
    } else {
      break;
    }

    if (cb(parent)) {
      return parent;
    }
    return false;
  };
};

/**
 * Finds parent method with matching signature
 *
 * @param {HTMLElement} node
 * @param {*} args
 * @memberof module:aofl-js/component-utils-package
 * @return {Object}
 */
const findParent = (node, ...args) => {
  return traverseParents(node, (parent) => {
    let found = true;
    for (let i = 0; i < args.length; i++) {
      if (typeof parent[args[i]] === 'undefined') {
        found = false;
        break;
      }
    }

    return found;
  });
};

/**
 * Finds parent method with matching attributes
 *
 * @param {HTMLElement} node
 * @param {*} args
 * @memberof module:aofl-js/component-utils-package
 * @return {Object}
 */
const findParentByAttributes = (node, ...args) => {
  return traverseParents(node, (parent) => {
    console.log(parent, args);
    let found = true;
    for (let i = 0; i < args.length; i++) {
      console.log(typeof parent.hasAttribute === 'undefined', !parent.hasAttribute(args[i]));
      if (typeof parent.hasAttribute === 'undefined' || !parent.hasAttribute(args[i])) {
        found = false;
        break;
      }
    }

    return found;
  });
};

export {
  findParent,
  findParentByAttributes,
  traverseParents
};

