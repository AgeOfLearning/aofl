/**
 * Implements AoflElement
 *
 * @version 4.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {html, LitElement, TemplateResult} from 'lit';
import {has, get} from '@aofl/object-utils';

type HtmlType = typeof html;
type AoflElementTemplate = (ctx: any, html: HtmlType) => TemplateResult;
/**
 * Base class for all aofl-js elements.
 *
 * @memberof module:@aofl/element
 * @extends LitElement
 */
class AoflElement extends LitElement {
  /**
    * Creates an instance of AoflElement.
    */
  constructor() {
    super();
  }

  hmrConnected() {}
  hmrDisconnected() {}

  // _mapStateProperties = new Map<string, any>();
  // _mapStateUnsubscribe = new Map<string, any>();

  connectedCallback() {
    super.connectedCallback();

    if (typeof (this as any)._mapStateProperties !== 'undefined') {
      (this as any)._mapStateProperties.forEach((value: any, key: string) => {
        const updateValue = () => {
          const state = value.store.state;
          if (has(state, value.path)) {
            (this as any)[key] = get(state, value.path);
          } else {
            (this as any)[key] = get(value.store, value.path);
          }
        };

        updateValue();
        const unsubscribe = value.store.subscribe(updateValue);
        if (typeof (this as any)._mapStateUnsubscribe === 'undefined') {
          (this as any)._mapStateUnsubscribe = new Map<string, any>();
        }
        (this as any)._mapStateUnsubscribe.set(key, unsubscribe);
      });
    }

    this.hmrConnected();
  }

  disconnectedCallback() {
    if (typeof (this as any)._mapStateUnsubscribe !== 'undefined') {
      (this as any)._mapStateUnsubscribe.forEach((unsubscribe: any) => {
        unsubscribe();
      });
      (this as any)._mapStateUnsubscribe.clear();
    }
    this.hmrDisconnected();
    super.disconnectedCallback();
  }
}

export {
  AoflElement,
  AoflElementTemplate,
  HtmlType
};
