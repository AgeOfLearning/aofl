/**
 * Finds parent method with matching signature
 * @param {HTMLElement} node
 * @param {*} args
 * @return {Object}
 */
const findParent = (node, ...args) => {
  let parent = node;
  if (args.length === 0) {
    throw new TypeError('At least 1 argument is required');
  }

  while (parent !== null) {
    let found = true;
    if (parent.assignedSlot) {
      parent = parent.assignedSlot;
    } else if (typeof parent.tagName === 'undefined' && typeof parent.host !== 'undefined') {
      parent = parent.host;
    } else if (parent.parentNode) {
      parent = parent.parentNode;
    } else {
      break;
    }

    for (let i = 0; i < args.length; i++) {
      if (typeof parent[args[i]] === 'undefined') {
        found = false;
        break;
      }
    }

    if (found) {
      return parent;
    }
  };

  throw new Error(`Parent with ${args} not found`);
};

export default findParent;
