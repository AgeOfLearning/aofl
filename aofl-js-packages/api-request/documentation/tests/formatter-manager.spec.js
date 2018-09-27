/* eslint no-invalid-this: "off" */
import FormatterManager from '../../src/formatter-manager';

describe('@aofl/api-request/src/formatter-manager', function() {
  beforeEach(function() {
    this.formatterManager = new FormatterManager();
  });

  context('addFormatter()', function() {
    it('should add a formatter to the list of formatters', function() {
      this.formatterManager.addFormatter('json', {
        pack() {},
        unpack() {}
      });

      expect(this.formatterManager).to.have.a.property('formatters').to.have.all.keys(['json']);
    });

    it('should throw a TypeError when an invalid formatter is supplied', function() {
      const badFn = () => {
        this.formatterManager.addFormatter('json', {});
      };

      expect(badFn).to.throw(TypeError);
    });

    it('should throw an error if a formatter already exists', function() {
      this.formatterManager.addFormatter('json', {
        pack() {},
        unpack() {}
      });

      const badFn = () => {
        this.formatterManager.addFormatter('json', {
          pack() {},
          unpack() {}
        });
      };

      expect(badFn).to.throw(Error, 'Cannot replace an existing format.');
    });
  });

  context('getFormatter()', function() {
    it('should return the same formatter object', function() {
      const formatter = {
        pack() {},
        unpack() {}
      };
      this.formatterManager.addFormatter('json', formatter);

      expect(this.formatterManager.getFormatter('json')).to.be.equal(formatter);
    });

    it('should only return formatters and not object properties', function() {
      expect(this.formatterManager.getFormatter('hasOwnProperty')).to.be.undefined;
    });
  });
});
