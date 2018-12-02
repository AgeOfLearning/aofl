/* eslint-disable */
import i18nMixin from '../src/i18n-mixin';
import AoflElement from '@aofl/web-components/aofl-element';
import {render, html} from 'lit-html';
import {until} from 'lit-html/directives/until';

describe('@aofl/i18n-mixin', function() {
  before(async function() {
    const templates = {
      default: {
        template(ctx, html) {
          return html`
            <h1>${until(ctx.__('<tt-1>', 'Greeting and salutations!'))}</h1>
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

  });

  beforeEach(function() {
    this.testContainer = getTestContainer();
    render(html`
      <i18n-mixin-element-no-lang id="I18nNoLanguageMapTestFixture" lang="de-DE"></i18n-mixin-element-no-lang>
    `, this.testContainer);

    this.element = this.testContainer.querySelector('#I18nNoLanguageMapTestFixture');
    this.element.count = 1;
  });

  afterEach(function() {
    document.documentElement.removeAttribute('lang');
    cleanTestContainer(this.testContainer);
  });


  context('__()', function() {
    it('Should default to source language', async function() {
      await this.element.updateComplete;
      await new Promise((resolve) => {
        setTimeout(() => {
          expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
          resolve();
        }, 100);
      });
    });

    it('Should update to German layout', async function() {
      await this.element.updateComplete;
      await new Promise((resolve) => {
        setTimeout(() => {
          expect(this.element.shadowRoot.querySelector('h1').innerText).to.equal('German version');
          resolve();
        }, 100);
      });
    });
  });

  context('_c()', function() {
    it('Should show the default text for one', async function() {
      await this.element.updateComplete;
      await new Promise((resolve) => {
        setTimeout(() => {
          expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('There is one person here and that person is Albert Einstein');
          resolve();
        }, 100);
      });
    });

    it('Should show the default text for two', async function() {
      await this.element.updateComplete;
      this.element.count = 2;
      this.element.requestUpdate();
      await this.element.updateComplete;
      await new Promise((resolve) => {
        setTimeout(() => {
          expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('There are two people here');
          resolve();
        }, 100);
      });
    });

    it('Should show default text for more', async function() {
      await this.element.updateComplete;
      this.element.count = 3;
      this.element.requestUpdate();
      await this.element.updateComplete;
      await new Promise((resolve) => {
        setTimeout(() => {
          expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('There are many people here!');
          resolve();
        }, 100);
      });
    });
  });
});
