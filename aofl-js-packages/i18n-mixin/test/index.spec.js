/* eslint-disable */
import i18nMixin from '../src/i18n-mixin';
import AoflElement from '@aofl/web-components/aofl-element';
import {render, html} from 'lit-html';

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
          '<tt-4>-3': {
            text: 'Es gibt viele Leute hier!'
          }
        }
      })
    };
    const templates = {
      default: {
        template(context, html) {
          return html`
            <h1>${context.__('<tt-1>', 'Greeting and salutations!')}</h1>
            <h2>${context._r(context.__('<tt-2>', 'How are you %r1%'), context.person)}</h2>
          `
        },
        styles: []
      },
      'de-DE': {
        template(context, html) {
          return html`
            <h1>German version</h1>
            <h2>${context._r(context.__('<tt-3>', 'How are you %r1%'), context.person)}</h2>
            <p>${context._r(context._c('<tt-4>', 'There %c1%', {
              1: 'is one person here and that person is %r1%',
              2: 'are two people here',
              3: 'are many people here!'
            }, context.count), context.person)}</p>
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
        return 'my-comp';
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
        return 'my-comp-no-attrs';
      }
      render() {
        return super.render(templates);
      }
    };
    customElements.define(MyComp.is, MyComp);
    customElements.define(MyCompNoAttrs.is, MyCompNoAttrs);
    render(html`
      <test-fixture id="I18nTestFixture">
        <template>
          <my-comp lang="de-DE"></my-comp>
        </template>
      </test-fixture>
      <test-fixture id="I18nTestFixtureNoAttr">
        <template>
          <my-comp-no-attrs foo="bar"></my-comp-no-attrs>
        </template>
      </test-fixture>
      `, document.getElementById('test-container'));
  });

  beforeEach(function() {
    this.element = fixture('I18nTestFixture');
    this.elementNoAttr = fixture('I18nTestFixtureNoAttr');
  });

  afterEach(function() {
    document.documentElement.removeAttribute('lang');
  });

  context('__()', function() {
    it('Should translate the string to German', async function() {
      try {
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('Wie geht es dir Albert Einstein');
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should not translate the string to German', async function() {
      try {
        await this.element.updateComplete;
        this.element.setAttribute('lang', 'en-US');
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
            resolve();
          }, 250);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should update to German layout', async function() {
      try {
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h1').innerText).to.equal('German version');
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('_c()', function() {
    it('Should translate for one', async function() {
      try {
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Es gibt eine Person hier und diese Person ist Albert Einstein');
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should translate for two', async function() {
      try {
        await new Promise((resolve) => {
          this.element.count = 2;

          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Hier sind zwei Leute');
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should translate for more', async function() {
      try {
        await new Promise((resolve) => {
          this.element.count = 3;
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Es gibt viele Leute hier!');
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('langListener()', function() {
    it('Should update to html lang change if local lang is not set', async function() {
      try {
        await new Promise((resolve) => {
          document.documentElement.setAttribute('lang', 'de-DE');
          this.element.setAttribute('lang', '');

          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('Wie geht es dir Albert Einstein');
            resolve();
          }, 500);
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
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should not trigger updates on non html lang changes', async function() {
      try {
        await this.element.updateComplete;
        this.element.setAttribute('lang', 'en-US');
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('No default attribute', function() {
    it('Should have no default lang', async function() {
      try {
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.elementNoAttr.getAttribute('lang')).to.be.null;
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should have no effect on the change of foo attr', async function() {
      try {
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.elementNoAttr.getAttribute('lang')).to.be.null;
            resolve();
          }, 500);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
