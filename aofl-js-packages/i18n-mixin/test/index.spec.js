/* eslint-disable */
import i18nMixin from '../modules/i18n-mixin';
import {AoflElement} from '@aofl/element';
import {render, html} from 'lit-html';
import {until} from 'lit-html/directives/until';

describe('@aofl/i18n-mixin', function() {
  before(function() {
    const translations = {
      'de-DE': () => Promise.resolve({
        default: {
          '<tt-1>': {
            text: 'Startseite'
          },
          '<tt-2>': {
            text: 'Gruß und Gruß!'
          },
          '<tt-3>': {
            text: 'Wie geht es dir %%r1::context.person%%'
          },
          '<tt-4>-1': {
            text: 'Es gibt eine Person hier und diese Person ist %%r1::context.person%%'
          },
          '<tt-4>-2': {
            text: 'Hier sind zwei Leute'
          },
          '<tt-4>-%other%': {
            text: 'Es gibt viele Leute hier!'
          }
        }
      })
    };
    const templates = {
      default: {
        template(ctx, html) {
          return html`
            <h1>${until(ctx.__('<tt-1>', 'Greeting and salutations!'), '...')}</h1>
            <h2>${until(ctx._r(ctx.__('<tt-2>', 'How are you %r1%'), ctx.person))}</h2>
          `
        },
        styles: []
      },
      'de-DE': {
        template(ctx, html) {
          return html`
            <h1>German version</h1>
            <h2>${until(ctx._r(ctx.__('<tt-3>', 'How are you %r1%'), ctx.person))}</h2>
            <p>${until(ctx._r(ctx._c('<tt-4>', 'There %c1%', {
              1: 'is one person here and that person is %r1%',
              2: 'are two people here',
              '%other%': 'are many people here!'
            }, ctx.count), ctx.person))}</p>
          `;
        },
        styles: []
      }
    };
    class MyComp extends i18nMixin(AoflElement) {
      constructor() {
        super();
        this.translations = translations;
        this.count = 1;
        this.person = 'Albert Einstein';
      }
      static get properties() {
        return {
          count: Number
        }
      }
      static get is() {
        return 'i18n-mixin-element';
      }
      render() {
        return super.render(templates);
      }
    };
    class MyCompNoAttrs extends i18nMixin(AoflElement) {
      constructor() {
        super();
        this.translations = translations;
        this.person = 'Albert Einstein';
        this.count = 1;
      }
      static get properties() {
        return {
          foo: String
        }
      }
      static get is() {
        return 'i18n-mixin-element-no-attrs';
      }
      render() {
        return super.render(templates);
      }
    };
    customElements.define(MyComp.is, MyComp);
    customElements.define(MyCompNoAttrs.is, MyCompNoAttrs);

  });

  beforeEach(function() {
    this.testContainer = getTestContainer();
    render(html`
      <i18n-mixin-element id="I18nTestFixture" lang="de-DE"></i18n-mixin-element>

      <i18n-mixin-element-no-attrs id="I18nTestFixtureNoAttr" foo="bar"></i18n-mixin-element-no-attrs>
      `, this.testContainer);

    this.element = this.testContainer.querySelector('#I18nTestFixture');
    this.elementNoAttr = this.testContainer.querySelector('#I18nTestFixtureNoAttr');
  });

  afterEach(function() {
    document.documentElement.removeAttribute('lang');
    cleanTestContainer(this.testContainer);
  });

  it('Should return translations from i18n class', async function() {
    await this.element.updateComplete;
    expect(this.element.translations).to.equal(this.element.i18n.translations);
  });
  context('__()', function() {
    it('Should translate the string to German', async function() {
      try {
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('Wie geht es dir Albert Einstein');
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should not translate the string to German', async function() {
      try {
        await this.element.updateComplete;
        this.element.setAttribute('lang', 'en-US');
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should update to German layout', async function() {
      try {
        await this.element.updateComplete;
        expect(this.element.shadowRoot.querySelector('h1').innerText).to.equal('German version');
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('_c()', function() {
    it('Should translate for one', async function() {
      try {
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Es gibt eine Person hier und diese Person ist Albert Einstein');
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should translate for two', async function() {
      try {
        await this.element.updateComplete;
        this.element.count = 2;
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Hier sind zwei Leute');
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should translate for more', async function() {
      try {
        await this.element.updateComplete;
        this.element.count = 3;
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Es gibt viele Leute hier!');
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('langListener()', function() {
    it('Should update to html lang change if local lang is not set', async function() {
      try {
        await this.element.updateComplete;
        document.documentElement.setAttribute('lang', 'de-DE');
        this.element.setAttribute('lang', '');

        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('Wie geht es dir Albert Einstein');
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should not update to html lang change if local lang is set', async function() {
      try {
        await this.element.updateComplete;
        this.element.setAttribute('lang', 'en-US');
        document.documentElement.setAttribute('lang', 'de-DE');
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should not trigger updates on non html lang changes', async function() {
      try {
        await this.element.updateComplete;
        this.element.setAttribute('lang', 'en-US');
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('No default attribute', function() {
    it('Should have no default lang', async function() {
      try {
        await this.elementNoAttr.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.elementNoAttr.getAttribute('lang')).to.be.null;
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should have no effect on the change of foo attr', async function() {
      try {
        await this.elementNoAttr.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.elementNoAttr.getAttribute('lang')).to.be.null;
            resolve();
          }, 100);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
