 /**
 * isInViewPort() check whether or not the supplied element is within the visible area of the
 * screen. The threshold values are multipliers of their respective dimension. 0 means the exact
 * viewport dimensions and .5 means viewport + half of viewport.
 *
 * @summary is-in-viewport
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @param {HTMLElement} node
 * @param {Number} widthThreshold
 * @param {Number} heightThreshold
 * @memberof module:aofl-js/component-utils-package
 * @return {Boolean}
 */
const isInViewPort = (node, widthThreshold = 0, heightThreshold = 0) => {
  let {top, right, bottom, left} = node.getBoundingClientRect();
  let vWidth = window.innerWidth || document.documentElement.clientWidth;
  let vHeight = window.innerHeight || document.documentElement.clientHeight;
  let wThreshold = vWidth * widthThreshold;
  let hThreshold = vHeight * heightThreshold;

  return bottom > -hThreshold && right > -vWidth && left < (vWidth + wThreshold) && top < (vHeight + hThreshold);
};

export default isInViewPort;
