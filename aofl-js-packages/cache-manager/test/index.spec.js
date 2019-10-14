/* eslint no-invalid-this: "off" */
import {CacheManager} from '../modules/cache-manager';
import {cacheTypeEnumerate} from '../modules/cache-type-enumerate';
import {MemoryStorage} from '../modules/memory-storage';


describe('@aofl/cache-manager#CacheManager', function() {
  const namespace = 'ns';

  context('destruct()', function() {
    it('should set all properties to null', function() {
      const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
      cacheManager.setItem('key1', 'value1');
      cacheManager.removeItem('key2');

      cacheManager.destruct();

      expect(cacheManager).to.have.property('namespace', null);
      expect(cacheManager).to.have.property('storage', null);
      expect(cacheManager).to.have.property('storageType', null);
      expect(cacheManager).to.have.property('expire', null);
      expect(cacheManager).to.have.property('storedKeys', null);
      expect(cacheManager).to.have.property('interval', null);
    });
  });

  context('memoryStorage', function() {
    beforeEach(function() {
      const cm = new CacheManager(namespace, cacheTypeEnumerate.MEMORY);
      cm.clear();
    });
    it('should reference a MemoryStorage storage', function() {
      const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.MEMORY);

      expect(cacheManager.storage).to.be.equal(MemoryStorage);
    });

    context('setItem()', function() {
      it('should add items to the list', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        cacheManager.setItem('key', 'value');

        expect(cacheManager.size).to.be.equal(1);
      });

      it('setItem() should add multiple items to the list', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key2', 'value2');

        expect(cacheManager.size).to.be.equal(2);
      });

      it('setItem() should replace existing key', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key1', 'value2');

        expect(cacheManager.getItem('key1')).to.be.equal('value2');
      });
    });

    context('getItem()', function() {
      it('should return value if key exists', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        cacheManager.setItem('key1', 'value1');

        expect(cacheManager.getItem('key1')).to.be.equal('value1');
      });

      it('should return null if key does not exists', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        expect(cacheManager.getItem('key1')).to.be.null;
      });
    });

    context('getCollection()', function() {
      it('should return stored keys', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key2', 'value2');

        const collection = cacheManager.getCollection();
        expect(typeof collection).to.be.equal('object');
        expect(Object.keys(collection)).to.have.property('length', 2);
      });
    });

    context('removeItem()', function() {
      it('should remove existing key', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        cacheManager.setItem('key1', 'value1');
        cacheManager.removeItem('key1');

        expect(cacheManager.getItem('key1')).to.be.null;
      });

      it('should have no effect if key does not exist', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        cacheManager.setItem('key1', 'value1');
        cacheManager.removeItem('key2');

        expect(cacheManager).to.have.property('size', 1);
      });
    });

    context('getStoredKeys()', function() {
      const namespace2 = 'ns2';
      afterEach(function() {
        const cacheManager2 = new CacheManager(namespace2, cacheTypeEnumerate.Memory);
        cacheManager2.clear();
      });
      it('should return keys that are in the current namespace', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory);
        const cacheManager2 = new CacheManager(namespace2, cacheTypeEnumerate.Memory);
        cacheManager.setItem('key1', 'value1');
        cacheManager2.setItem('key1', 'value1');

        expect(cacheManager.getStoredKeys()).to.have.property('length', 1);
      });
    });

    context('expired data', function() {
      beforeEach(function() {
        this.clock = sinon.useFakeTimers();
      });

      afterEach(function() {
        this.clock.restore();
      });

      it('should automatically remove expired data', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory, 50);
        cacheManager.setItem('key1', 'value1');

        this.clock.tick(100);
        expect(cacheManager).to.have.property('size', 0);
      });

      it('should handle no expiration', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory, 0);
        cacheManager.setItem('key1', 'value1');

        this.clock.tick(100);
        expect(cacheManager).to.have.property('size', 1);
      });

      context('getItem()', function() {
        it('should return null key has expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory, 50);
          cacheManager.setItem('key1', 'value1');

          this.clock.tick(51);
          expect(cacheManager.getItem('key1')).to.be.null;
        });
      });

      context('getCollection()', function() {
        it('should return stored keys that are not expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          const collection = cacheManager.getCollection();
          expect(Object.keys(collection)).to.have.property('length', 1);
        });
      });

      context('isExpired()', function() {
        it('should return true if key is expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key1')).to.be.true;
        });

        it('should return false if key is expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key2')).to.be.false;
        });

        it('should return false if never expires', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.Memory, 0);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key2')).to.be.false;
        });
      });
    });
  });

  context('localStorage', function() {
    beforeEach(function() {
      const cm = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
      cm.clear();
    });
    it('should reference a localStorage storage', function() {
      const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);

      expect(cacheManager.storage).to.be.equal(localStorage);
    });

    context('setItem()', function() {
      it('should add items to the list', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        cacheManager.setItem('key', 'value');

        expect(cacheManager.size).to.be.equal(1);
      });

      it('should add multiple items to the list', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key2', 'value2');

        expect(cacheManager.size).to.be.equal(2);
      });

      it('should replace existing key', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key1', 'value2');

        expect(cacheManager.getItem('key1')).to.be.equal('value2');
      });
    });

    context('getItem()', function() {
      it('should return value if key exists', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        cacheManager.setItem('key1', 'value1');

        expect(cacheManager.getItem('key1')).to.be.equal('value1');
      });

      it('should return null if key does not exists', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        expect(cacheManager.getItem('key1')).to.be.null;
      });
    });

    context('getCollection()', function() {
      it('should return stored keys', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key2', 'value2');

        const collection = cacheManager.getCollection();
        expect(typeof collection).to.equal('object');
        expect(Object.keys(collection)).to.have.property('length', 2);
      });
    });

    context('removeItem()', function() {
      it('should remove existing key', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        cacheManager.setItem('key1', 'value1');
        cacheManager.removeItem('key1');

        expect(cacheManager.getItem('key1')).to.be.null;
      });

      it('should have no effect if key does not exist', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        cacheManager.setItem('key1', 'value1');
        cacheManager.removeItem('key2');

        expect(cacheManager).to.have.property('size', 1);
      });
    });

    context('getStoredKeys()', function() {
      const namespace2 = 'ns2';
      afterEach(function() {
        const cacheManager2 = new CacheManager(namespace2, cacheTypeEnumerate.LOCAL);
        cacheManager2.clear();
      });
      it('should return keys that are in the current namespace', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL);
        const cacheManager2 = new CacheManager(namespace2, cacheTypeEnumerate.LOCAL);
        cacheManager.setItem('key1', 'value1');
        cacheManager2.setItem('key1', 'value1');

        expect(cacheManager.getStoredKeys()).to.have.property('length', 1);
      });
    });

    context('expired data', function() {
      beforeEach(function() {
        this.clock = sinon.useFakeTimers();
      });

      afterEach(function() {
        this.clock.restore();
      });

      it('should automatically remove expired data', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL, 50);
        cacheManager.setItem('key1', 'value1');

        this.clock.tick(100);
        expect(cacheManager).to.have.property('size', 0);
      });

      it('should handle no expiration', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL, 0);
        cacheManager.setItem('key1', 'value1');

        this.clock.tick(100);
        expect(cacheManager).to.have.property('size', 1);
      });

      context('getItem()', function() {
        it('should return null key has expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL, 50);
          cacheManager.setItem('key1', 'value1');

          this.clock.tick(51);
          expect(cacheManager.getItem('key1')).to.be.null;
        });
      });

      context('getCollection()', function() {
        it('should return stored keys that are not expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          const collection = cacheManager.getCollection();
          expect(Object.keys(collection)).to.have.property('length', 1);
        });
      });

      context('isExpired()', function() {
        it('should return true if key is expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key1')).to.be.true;
        });

        it('should return false if key is expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key2')).to.be.false;
        });

        it('should return false if never expires', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.LOCAL, 0);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key2')).to.be.false;
        });
      });
    });
  });

  context('sessionStorage', function() {
    beforeEach(function() {
      const cm = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
      cm.clear();
    });
    it('should reference a sessionStorage storage', function() {
      const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);

      expect(cacheManager.storage).to.be.equal(sessionStorage);
    });

    context('setItem()', function() {
      it('should add items to the list', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        cacheManager.setItem('key', 'value');

        expect(cacheManager.size).to.be.equal(1);
      });

      it('should add multiple items to the list', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key2', 'value2');

        expect(cacheManager.size).to.be.equal(2);
      });

      it('should replace existing key', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key1', 'value2');

        expect(cacheManager.getItem('key1')).to.be.equal('value2');
      });
    });

    context('getItem()', function() {
      it('should return value if key exists', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        cacheManager.setItem('key1', 'value1');

        expect(cacheManager.getItem('key1')).to.be.equal('value1');
      });

      it('should return null if key does not exists', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        expect(cacheManager.getItem('key1')).to.be.null;
      });
    });

    context('getCollection()', function() {
      it('should return stored keys', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        cacheManager.setItem('key1', 'value1');
        cacheManager.setItem('key2', 'value2');

        const collection = cacheManager.getCollection();
        expect(typeof collection).to.equal('object');
        expect(Object.keys(collection)).to.have.property('length', 2);
      });
    });

    context('removeItem()', function() {
      it('should remove existing key', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        cacheManager.setItem('key1', 'value1');
        cacheManager.removeItem('key1');

        expect(cacheManager.getItem('key1')).to.be.null;
      });

      it('should have no effect if key does not exist', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        cacheManager.setItem('key1', 'value1');
        cacheManager.removeItem('key2');

        expect(cacheManager).to.have.property('size', 1);
      });
    });

    context('getStoredKeys()', function() {
      const namespace2 = 'ns2';
      afterEach(function() {
        const cacheManager2 = new CacheManager(namespace2, cacheTypeEnumerate.SESSION);
        cacheManager2.clear();
      });
      it('should return keys that are in the current namespace', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION);
        const cacheManager2 = new CacheManager(namespace2, cacheTypeEnumerate.SESSION);
        cacheManager.setItem('key1', 'value1');
        cacheManager2.setItem('key1', 'value1');

        expect(cacheManager.getStoredKeys()).to.have.property('length', 1);
      });
    });

    context('expired data', function() {
      beforeEach(function() {
        this.clock = sinon.useFakeTimers();
      });

      afterEach(function() {
        this.clock.restore();
      });

      it('should automatically remove expired data', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION, 50);
        cacheManager.setItem('key1', 'value1');

        this.clock.tick(100);
        expect(cacheManager).to.have.property('size', 0);
      });

      it('should handle no expiration', function() {
        const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION, 0);
        cacheManager.setItem('key1', 'value1');

        this.clock.tick(100);
        expect(cacheManager).to.have.property('size', 1);
      });

      context('getItem()', function() {
        it('should return null key has expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION, 50);
          cacheManager.setItem('key1', 'value1');

          this.clock.tick(51);
          expect(cacheManager.getItem('key1')).to.be.null;
        });
      });

      context('getCollection()', function() {
        it('should return stored keys that are not expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          const collection = cacheManager.getCollection();
          expect(Object.keys(collection)).to.have.property('length', 1);
        });
      });

      context('isExpired()', function() {
        it('should return true if key is expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key1')).to.be.true;
        });

        it('should return false if key is expired', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION, 49);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key2')).to.be.false;
        });

        it('should return false if never expires', function() {
          const cacheManager = new CacheManager(namespace, cacheTypeEnumerate.SESSION, 0);
          cacheManager.setItem('key1', 'value1');
          this.clock.tick(25);
          cacheManager.setItem('key2', 'value2');
          this.clock.tick(25);

          expect(cacheManager.isExpired('key2')).to.be.false;
        });
      });
    });
  });
});
