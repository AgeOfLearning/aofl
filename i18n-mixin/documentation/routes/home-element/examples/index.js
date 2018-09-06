/* eslint-disable */
class MyComp extends i18nMixin(AoflElement) {
  constructor() {
    super();
    this.langMap = langMap;
    this.lang = 'de-DE';
  }
  static get is() {
    return 'my-comp';
  }
  _render() {
    let person = 'Albert Einstein';
    return html`${this.__('How are you %s1', person)}`;
  }
};

customElements.define(MyComp.is, MyComp);
