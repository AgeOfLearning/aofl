import {isInViewport} from './is-in-viewport';

const isInViewportMixin = (superClass) => {
  /**
   * Mixes the superClass with functions necessary to detect if the element is within the visible
   * area of the page.
   * @summary is-in-viewport-mixin
   * @version 1.0.0
   * @author Arian Khosravi <arian.khosravi@aofl.com>
   * @memberof module:aofl-js/component-utils-package
   *
   * @requires module:aofl-js/component-utils-package/src/is-in-viewport
   */
  class IsInViewportClass extends superClass {
    /**
     * Creates an instance of IsInViewportClass.
     * @param {*} args
     */
    constructor(...args) {
      super(...args);
      this.trackScrollHosts = [window];
      this.isWithinViewport;
      this.onceWithinViewport = false;

      this.checkInViewport = this.checkInViewport.bind(this);
    }

    /**
     *
     *
     * @param {*} args
     */
    connectedCallback(...args) {
      super.connectedCallback(...args);
      this.addListeners();
    }

    /**
     *
     */
    checkInViewport() {
      const oldIsWithinViewport = this.isWithinViewport;

      this.isWithinViewport = this.offsetHeight > 0 && this.offsetWidth > 0 &&
      isInViewport(this, this.widthThreshold, this.heightThreshold);

      if (!this.onceWithinViewport && this.isWithinViewport === true) {
        this.onceWithinViewport = true;
        this.firstWithinViewport();
      }

      if (this.isWithinViewport !== oldIsWithinViewport) {
        this.withinViewportUpdated(this.isWithinViewport, oldIsWithinViewport);
      }
    }

    /**
     *
     */
    firstUpdated() {
      this.checkInViewport();
    }

    /**
     *
     */
    addListeners() {
      let parent = this;
      /* istanbul ignore next */
      while (parent !== null) {
        if (parent.assignedSlot) {
          parent = parent.assignedSlot;
        } else if (typeof parent.tagName === 'undefined' && typeof parent.host !== 'undefined') {
          this.trackScrollHosts.push(parent);
          parent = parent.host;
        } else if (parent.parentNode) {
          parent = parent.parentNode;
        } else {
          break;
        }
      }

      window.addEventListener('resize', this.checkInViewport, true);
      for (let i = 0; i < this.trackScrollHosts.length; i++) {
        this.trackScrollHosts[i].addEventListener('scroll', this.checkInViewport, true);
      }
    }

    /* istanbul ignore next */
    /**
     * firstWithinViewport() is invoked when the element scrolls into view for the first time. This
     * function should be implemented by the sub class.
     *
     * @protected
     */
    firstWithinViewport() {

    }

    /* istanbul ignore next */
    /**
     * withinViewportUpdated() is invoked anytime the element enters or exists the viewport. This
     * function should be implemented by the sub class.
     *
     * @protected
     * @param {Boolean} newValue
     * @param {Boolean} oldValue
     */
    withinViewportUpdated() {}

    /**
     * When stopiIsInViewportCheck() is invoked it removes the event listeners and stops invoking
     * the withinViewportUpdated() function. This is useful when we want to disconnect the event
     * listeners and keep the component attached to dom. For example, consider lazy loading images
     * with aofl-img. Once the image is loaded it is no longer necessary to check isInViewStatus.
     *
     * @protected
     */
    stopIsInViewportCheck() {
      window.removeEventListener('resize', this.checkInViewport);
      for (let i = 0; i < this.trackScrollHosts.length; i++) {
        this.trackScrollHosts[i].removeEventListener('scroll', this.checkInViewport, true);
      }
    }

    /**
     *
     *
     * @param {*} args
     */
    disconnectedCallback(...args) {
      this.stopIsInViewportCheck();
      super.disconnectedCallback(...args);
    }
  }

  return IsInViewportClass;
};

export {
  isInViewportMixin
};
