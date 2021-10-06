import {AoflElement, AoflElementTemplate} from './aofl-element';
import {html, TemplateResult} from 'lit'

type htmlType = typeof html;

class A extends AoflElement {
  get template() : AoflElementTemplate {

    return (ctx: A, html: htmlType) : TemplateResult => html``;
  }
}

new A();
