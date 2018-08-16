import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
// console.log(dedupingMixin);

export default dedupingMixin((superClass) => {
  /**
   *
   *
   * @class ParentDepMixin
   * @extends {dedupingMixin(superClass)}
   */
  class ParentDepMixin extends superClass {
    /**
     *
     *
     * @param {String[]} args
     * @return {HTMLElement}
     * @memberof ParentDepMixin
     */
    findParent(...args) {
      let parent = this;
      if (args.length === 0) {
        throw new Error('at least 1 argument is required');
      }

      while (parent !== null) {
        const found = true;
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
    }
  }

  return ParentDepMixin;
});
