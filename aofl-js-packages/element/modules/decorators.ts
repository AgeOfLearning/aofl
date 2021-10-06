/**
 * @summary decorators
 * @version 4.0.0
 * @since 3.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */
import {customElement as litCustomElement} from 'lit/decorators.js';

/**
 * Allow for custom element classes with private constructors
 */
 declare type CustomElementClass = Omit<typeof HTMLElement, 'new'>;

/**
 * extends lit-element's custom-element decorator and prevents an error being thrown when
 * the element is already defined when hot module replacement is enabled.
 *
 * @memberof module:@aofl/element
 * @param tagName
 * @return any
 */
export function customElement(tagName: string) {
  return (descriptor: CustomElementClass | ClassDecorator) => {
    if (window.aofljsConfig.hot &&
     window.customElements.get(tagName) !== void 0) {
      return descriptor;
    }
    return litCustomElement(tagName)(descriptor);
  };
}
