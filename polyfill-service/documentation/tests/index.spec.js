/* eslint no-invalid-this: "off" */
import {Polyfill} from '../../';

describe('@aofl/polyfill-service/polyfill', function() {
  context('supported()', function() {
    it('should detect if window has a document object', function() {
      expect(Polyfill.supported('document')).to.be.true;
    });

    it('should detect if window doest not have the specified property', function() {
      expect(Polyfill.supported('$#%')).to.be.false;
    });

    it('should detect if window has the specified nested properties', function() {
      expect(Polyfill.supported('document.body')).to.be.trueq;
    });

    it('should detect if window doest not have the specified nested property', function() {
      expect(Polyfill.supported('document.$#%')).to.be.false;
    });
  });

  context('load()', function() {
    before(function() {
      this.unsupportedProperty = '$#%-not-supported';
      this.supportedProperty = 'Math';

      this.polyfillsConfig = {
        [this.unsupportedProperty]: sinon.spy(),
        [this.supportedProperty]: sinon.spy()
      };
    });

    it('should load unsupported features', function() {
      Polyfill.load(this.unsupportedProperty, this.polyfillsConfig);
      expect(this.polyfillsConfig[this.unsupportedProperty].called).to.be.true;
    });

    it('shoulid not load supported features', function() {
      Polyfill.load(this.supportedProperty, this.polyfillsConfig);
      expect(this.polyfillsConfig[this.supportedProperty].called).to.be.false;
    });
  });

  context('loadAll()', function() {
    before(function() {
      sinon.stub(Polyfill, 'load').returns(Promise.resolve());
    });

    beforeEach(function() {
      this.config = {
        '$%/': () => {},
        'Math': () => {}
      };
    });

    afterEach(function() {
      Polyfill.load.reset();
    });

    it('should itterate through all pollyfils and call Polyfill.load on each one', function() {
      Polyfill.loadAll(this.config);
      expect(Polyfill.load.calledTwice).to.be.true;
    });
  });
});
