import {I18n} from '../modules/i18n';

context('I18n', function() {
  before(/** @this */ function() {
    this.translations = {
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
  });

  beforeEach(/** @this */ function() {
    this.i18n = new I18n(this.translations);
  });

  afterEach(/** @this */ function() {
    this.i18n = null;
  });

  context('getTranslationMap()', function() {
    it('Should return an empty object for default lang', /** @this */ async function() {
      const map = await this.i18n.getTranslationMap('en-US');
      expect(map).to.eql({});
    });
    it('Should return an empty object translation for given lang does not exist', /** @this */ async function() {
      const map = await this.i18n.getTranslationMap('zh-CN');
      expect(map).to.eql({});
    });

    it('Should return the translation map', /** @this */ async function() {
      const map = await this.i18n.getTranslationMap('de-DE');
      const defaultMap = await this.translations['de-DE']();
      expect(map).to.eql(defaultMap.default);
    });

    context('translation set after constructor', function() {
      beforeEach(/** @this */ function() {
        this.i18n = new I18n();
        this.i18n.translations = this.translations;
      });

      it('Should return an empty object for default lang', /** @this */ async function() {
        const map = await this.i18n.getTranslationMap('en-US');
        expect(map).to.eql({});
      });
      it('Should return an empty object translation for given lang does not exist', /** @this */ async function() {
        const map = await this.i18n.getTranslationMap('zh-CN');
        expect(map).to.eql({});
      });

      it('Should return the translation map', /** @this */ async function() {
        const map = await this.i18n.getTranslationMap('de-DE');
        const defaultMap = await this.translations['de-DE']();
        expect(map).to.eql(defaultMap.default);
      });
    });
  });

  context('__()', function() {
    it('Should return translated text', /** @this */ async function() {
      this.i18n.lang = 'de-DE';
      const str = await this.i18n.__('<tt-1>', 'Home Page');
      expect(str).to.equal('Startseite');
    });

    it('Should return original text when translation doesn\'t exist', /** @this */ async function() {
      this.i18n.lang = 'zh-CN';
      const str = await this.i18n.__('<tt-1>', 'Home Page');
      expect(str).to.equal('Home Page');
    });

    afterEach(/** @this */ function() {
      this.i18n.lang = 'en-US';
    });
  });

  context('_r()', function() {
    it('Should return translated text', /** @this */ async function() {
      this.i18n.lang = 'de-DE';
      const str = await this.i18n._r(this.i18n.__('<tt-3>', 'How are you %r1%'), 'Albert');
      expect(str).to.equal('Wie geht es dir Albert');
    });

    it('Should return original text when translation doesn\'t exist', /** @this */ async function() {
      this.i18n.lang = 'zh-CN';
      const str = await this.i18n._r(this.i18n.__('<tt-3>', 'How are you %r1%'), 'Albert');
      expect(str).to.equal('How are you Albert');
    });

    afterEach(/** @this */ function() {
      this.i18n.lang = 'en-US';
    });
  });

  context('_c()', function() {
    it('Should return translated text (singular)', /** @this */ async function() {
      this.i18n.lang = 'de-DE';
      const str = await this.i18n._r(this.i18n._c('<tt-4>', '%c1%', {
        '1': 'There is one person here and this persion is %r1%',
        '2': 'There are 2 people here',
        '%other%': 'There are many people here'
      }, '1'), 'Albert');

      expect(str).to.equal('Es gibt eine Person hier und diese Person ist Albert');
    });

    it('Should return translated text (dual)', /** @this */ async function() {
      this.i18n.lang = 'de-DE';
      const str = await this.i18n._r(this.i18n._c('<tt-4>', '%c1%', {
        '1': 'There is one person here and this persion is %r1%',
        '2': 'There are 2 people here',
        '%other%': 'There are many people here'
      }, '2'), 'Albert');

      expect(str).to.equal('Hier sind zwei Leute');
    });

    it('Should return translated text (many)', /** @this */ async function() {
      this.i18n.lang = 'de-DE';
      const str = await this.i18n._r(this.i18n._c('<tt-4>', '%c1%', {
        '1': 'There is one person here and this persion is %r1%',
        '2': 'There are 2 people here',
        '%other%': 'There are many people here'
      }, '3'), 'Albert');

      expect(str).to.equal('Es gibt viele Leute hier!');
    });

    it('Should return original text (singular)', /** @this */ async function() {
      const str = await this.i18n._r(this.i18n._c('<tt-4>', '%c1%', {
        '1': 'There is one person here and this persion is %r1%',
        '2': 'There are 2 people here',
        '%other%': 'There are many people here'
      }, '1'), 'Albert');

      expect(str).to.equal('There is one person here and this persion is Albert');
    });

    it('Should return original text (dual)', /** @this */ async function() {
      const str = await this.i18n._r(this.i18n._c('<tt-4>', '%c1%', {
        '1': 'There is one person here and this persion is %r1%',
        '2': 'There are 2 people here',
        '%other%': 'There are many people here'
      }, '2'), 'Albert');

      expect(str).to.equal('There are 2 people here');
    });

    it('Should return original text (many)', /** @this */ async function() {
      const str = await this.i18n._r(this.i18n._c('<tt-4>', '%c1%', {
        '1': 'There is one person here and this persion is %r1%',
        '2': 'There are 2 people here',
        '%other%': 'There are many people here'
      }, '3'), 'Albert');

      expect(str).to.equal('There are many people here');
    });


    afterEach(/** @this */ function() {
      this.i18n.lang = 'en-US';
    });
  });
});
