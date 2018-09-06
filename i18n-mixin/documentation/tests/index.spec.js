/* eslint-disable */
import i18nMixin from '../../src/i18n-mixin';
import AoflElement from '@aofl/web-components/aofl-element';
import {html} from '@polymer/lit-element';
import {render} from 'lit-html';

describe('@aofl/i18n-mixin', function() {
  before(function() {
    const langMap = {
      "7b19b37e7fc3dfe3c3e1ad5b84c7f565":{"de-DE":"Startseite"},
      "b7951d7d44b8d3250a753a46f4b76f5b":{"de-DE":"Gruß und Gruß!"},
      "540d145a49f84752b9f0f74f7808765c":{"de-DE":"Wie geht es dir %s1"},
      "cedf634e8fd64019f98da9cad4f8ef42":{"de-DE":"Es gibt eine Person hier und diese Person ist %s1"},
      "4b6aec97fcbc3856a27a628ab4854186":{"de-DE":"Hier sind zwei Leute"},
      "7a750a246b85a075068b664f2d01bfc2":{"de-DE":"Es gibt viele Leute hier!"}
    };
    const templates = {
      default: {
        template(context, html) {
          return html`
            <h1>${context.__('Greeting and salutations!')}</h1>
            <h2>${context.__('How are you %s1', context.person)}</h2>
          `
        },
        styles: []
      },
      'de-DE': {
        template(context, html) {
          return html`
            <h1>German version</h1>
            <h2>${context.__('How are you %s1', context.person)}</h2>
            <p>${context._n({
              1: 'There is one person here and that person is %s1',
              2: 'There are two people here',
              3: 'There are many people here!'
            }, context.count, context.person)}</p>
          `;
        },
        styles: []
      }
    };
    class MyComp extends i18nMixin(AoflElement) {
      constructor() {
        super();
        this.langMap = langMap;
        this.count = 1;
      }
      static get properties() {
        return {
          count: Number
        }
      }
      static get is() {
        return 'my-comp';
      }
      _render() {
        this.person = 'Albert Einstein';
        return super._render(templates);
      }
    };
    class MyCompNoAttrs extends i18nMixin(AoflElement) {
      constructor() {
        super();
        this.langMap = langMap;
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
      _render() {
        this.person = 'Albert Einstein';
        return super._render(templates);
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

  afterEach(function () {
    document.getElementById('I18nTestFixture').restore();
  });

  context('__()', function() {
    it('Should translate the string to German', function() {
      expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('Wie geht es dir Albert Einstein');
    });

    it('Should not translate the string to German', function(done) {
      this.element.lang = 'en-US';
      setTimeout(() => {
        expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
        done();
      });
    });

    it('Should update to German layout', function(done) {
      setTimeout(() => {
        expect(this.element.shadowRoot.querySelector('h1').innerText).to.equal('German version');
        done();
      });
    });
  });

  context('_n()', function() {
    it('Should translate for one', function(done) {
      setTimeout(() => {
        expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Es gibt eine Person hier und diese Person ist Albert Einstein');
        done();
      });
    });

    it('Should translate for two', function(done) {
      this.element.count = 2;
      setTimeout(() => {
        expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Hier sind zwei Leute');
        done();
      });
    });

    it('Should translate for more', function(done) {
      this.element.count = 3;
      setTimeout(() => {
        expect(this.element.shadowRoot.querySelector('p').innerText).to.equal('Es gibt viele Leute hier!');
        done();
      });
    });

    it('Should throw error on invalid count', function() {
      expect(() => this.element._n({
        1: 'There is one person here and that person is %s1',
        2: 'There are two people here',
        3: 'There are many people here!'
      }, 5, 'Albert Einstein')).to.throw();
    });
  });

  context('langListener()', function() {
    it('Should update to html lang change if local lang is not set', function(done) {
      this.element.lang = '';
      document.documentElement.setAttribute('lang', 'de-DE');
      setTimeout(() => {
        expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('Wie geht es dir Albert Einstein');
        done();
      });
    });

    it('Should not update to html lang change if local lang is set', function(done) {
      this.element.lang = 'en-US';
      document.documentElement.setAttribute('lang', 'de-DE');
      setTimeout(() => {
        expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
        done();
      });
    });

    it('Should not trigger updates on non html lang changes', function(done) {
      this.element.lang = 'en-US';
      setTimeout(() => {
        expect(this.element.shadowRoot.querySelector('h2').innerText).to.equal('How are you Albert Einstein');
        done();
      });
    });
  });

  context('No default attribute', function() {
    it('Should have no default lang', function() {
      expect(this.elementNoAttr.lang).to.equal('');
    });
    it('Should have no effect on the change of foo attr', function() {
      expect(this.elementNoAttr.lang).to.equal('');
    });
  });
});
