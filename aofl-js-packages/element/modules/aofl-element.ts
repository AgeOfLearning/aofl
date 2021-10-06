/**
 * Implements AoflElement
 *
 * @version 4.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {html, LitElement, TemplateResult} from 'lit';

type HtmlType = typeof html;
type AoflElementTemplate = (ctx: AoflElement, html: HtmlType) => TemplateResult;
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

  /**
   * @param ctx
   * @param html
   * @return TemplateResult
   */
  get template() : AoflElementTemplate {
    return (ctx: AoflElement, html: HtmlType) : TemplateResult => html``;
  };

  protected render() : unknown {
    return this.template(this, html);
  }
}

export {
  AoflElement,
  AoflElementTemplate,
  HtmlType
};
