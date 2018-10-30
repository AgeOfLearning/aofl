import {MemoryStorage} from '../';

describe('@aofl/cache-manager/memory-storage', function() {
  beforeEach(function() {
    MemoryStorage.clear();
  });

  context('setItem()', function() {
    it('should add and the item to the storage', function() {
      MemoryStorage.setItem('key', 'value');
      expect(MemoryStorage.getItem('key')).to.be.equal('value');
    });

    it('should replace existing value', function() {
      MemoryStorage.setItem('key', 'value');
      MemoryStorage.setItem('key', 'modified');

      expect(MemoryStorage.getItem('key')).to.be.equal('modified');
    });
  });

  context('getItem()', function() {
    it('should return null if key does not exist', function() {
      expect(MemoryStorage.getItem('key')).to.be.null;
    });

    it('should return stored value based on key', function() {
      MemoryStorage.setItem('key', 'value');

      expect(MemoryStorage.getItem('key')).to.be.equal('value');
    });
  });

  context('removeItem()', function() {
    it('should remove existing Item', function() {
      MemoryStorage.setItem('key', 'value');
      MemoryStorage.removeItem('key');

      expect(MemoryStorage.getItem('key')).to.be.null;
    });

    it('should remove existing Item', function() {
      MemoryStorage.setItem('key1', 'value1');
      MemoryStorage.setItem('key2', 'value2');
      MemoryStorage.removeItem('key1');

      expect(MemoryStorage.getItem('key1')).to.be.null;
      expect(MemoryStorage.getItem('key2')).to.not.be.null;
    });

    it('should remain untouched if key does not exist', function() {
      MemoryStorage.setItem('key1', 'value1');
      MemoryStorage.setItem('key2', 'value2');
      MemoryStorage.removeItem('key3');

      expect(MemoryStorage).to.have.property('size', 2);
    });
  });

  context('clear()', function() {
    it('should remove all values', function() {
      MemoryStorage.setItem('key1', 'value1');
      MemoryStorage.setItem('key2', 'value2');
      MemoryStorage.clear();

      expect(MemoryStorage).to.have.property('size', 0);
    });
  });

  context('size', function() {
    it('should be initialized to 0', function() {
      expect(MemoryStorage).to.have.property('size', 0);
    });

    it('should return 1 when there\'s 1 item in the storage', function() {
      MemoryStorage.setItem('key1', 'value1');
      expect(MemoryStorage).to.have.property('size', 1);
    });

    it('should return the number of items in storage', function() {
      MemoryStorage.setItem('key1', 'value1');
      MemoryStorage.setItem('key2', 'value1');
      MemoryStorage.setItem('key3', 'value1');
      MemoryStorage.setItem('key4', 'value1');
      MemoryStorage.setItem('key5', 'value1');
      expect(MemoryStorage).to.have.property('size', 5);
    });
  });
});
