/* eslint-disable */
import i18nMixin from '../src/i18n-mixin';
import AoflElement from '@aofl/web-components/aofl-element';
import {render, html} from 'lit-html';

describe('@aofl/i18n-mixin', function() {
  before(function() {
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
              '%other%': 'are many people here!'
            }, context.count), context.person)}</p>
          `;
        },
        styles: []
      }
    };
    class MyComp extends i18nMixin(AoflElement) {
      constructor() {
        super();
        this.count = 1;
        this.person = 'Albert Einstein';
      }
      static get properties() {
        return {
          count: Number
        }
      }
      static get is() {
        return 'i18n-mixin-element-no-lang';
      }
      render() {
        return super.render(templates);
      }
    };

    customElements.define(MyComp.is, MyComp);

    this.testContainer = getTestContainer();
  });

  beforeEach(function() {
    render(html`
      <test-fixture id="I18nNoLanguageMapTestFixture">
        <template>
          <i18n-mixin-element-no-lang lang="de-DE"></i18n-mixin-element-no-lang>
        </template>
      </test-fixture>
      `, this.testContainer);
    this.element = fixture('I18nNoLanguageMapTestFixture');
  });

  afterEach(function() {
    document.documentElement.removeAttribute('lang');
  });

  // after(function() {
  //   this.testContainer.parentNode.removeChild(this.testContainer);
  // });

  context('__()', function() {
    it('Should default to source language', async function() {
      try {
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
            resolve();
          }, 300);
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
    it('Should show the default text for one', async function() {
      try {
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('There is one person here and that person is Albert Einstein');
            resolve();
          }, 300);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should show the default text for two', async function() {
      try {
        await this.element.updateComplete;
        this.element.count = 2;
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('There are two people here');
            resolve();
          }, 300);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should show default text for more', async function() {
      try {
        await this.element.updateComplete;
        this.element.count = 3;
        await this.element.updateComplete;
        await new Promise((resolve) => {
          setTimeout(() => {
            expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('There are many people here!');
            resolve();
          }, 300);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
