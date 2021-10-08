import {AoflElement, AoflElementTemplate} from './aofl-element';
import {html, TemplateResult} from 'lit'
import {customElement} from './decorators';

type htmlType = typeof html;

@customElement('tag-name')
class A extends AoflElement {

  get template() : AoflElementTemplate {
    return (ctx: A, html: htmlType) : TemplateResult => html``;
  }

  other() {

  }
}

new A();
