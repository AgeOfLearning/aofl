/* eslint no-invalid-this: "off" */
import ApiRequest from '../modules/api-request';
describe('@aofl/api-request/modules/api-request', function() {
  before(function() {
    this.formatter = {
      pack() {
        return {};
      },
      unpack(response) {
        return Promise.resolve(response);
      }
    };
  });

  beforeEach(function() {
    sinon.stub(window, 'fetch')
      .returns(Promise.resolve({
        json: () => Promise.resolve({})
      }));
    this.apiRequest = new ApiRequest();
    this.apiRequest.addFormatter('test', this.formatter);
  });

  afterEach(function() {
    this.apiRequest.clearCache('default');
    window.fetch.restore();
  });

  it('Should have static property DEFAULT_CACHE_NAMESPACE', function() {
    expect(ApiRequest.DEFAULT_CACHE_NAMESPACE).to.equal('ApiRequest');
  });

  context('getCacheManager', function() {
    it('Shourd return the default cacheManager', function() {
      const cacheManager = this.apiRequest.getCacheManager();
      expect(cacheManager.namespace).to.equal(ApiRequest.DEFAULT_CACHE_NAMESPACE);
    });

    it('Shourd return the default cacheManager', function() {
      const cacheManager = this.apiRequest.getCacheManager('test-namespace');
      expect(cacheManager.namespace).to.equal('test-namespace');
    });
  });

  context('updateCacheInterval()', function() {
    it('Should update cache interval', function() {
      const cacheManager = this.apiRequest.getCacheManager('test-namespace-interval');
      this.apiRequest.updateCacheInterval('test-namespace-interval', 0);
      expect(cacheManager.expire).to.equal(0);
    });
  });

  context('request()', function() {
    it('should make a network call to specified url', async function() {
      try {
        await this.apiRequest.request('http://example.org', '', 'test');
        expect(window.fetch.calledWith('http://example.org')).to.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should return cached result', async function() {
      try {
        await this.apiRequest.request('http://example.org', '', 'test');
        await this.apiRequest.request('http://example.org', '', 'test');

        expect(window.fetch.calledOnce).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke fetch when cache is disabled', async function() {
      try {
        await this.apiRequest.request('http://example.org', '', 'test');
        await this.apiRequest.request('http://example.org', '', 'test', false);

        expect(window.fetch.calledTwice).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke fetch when cache is cleared', async function() {
      try {
        await this.apiRequest.request('http://example.org', '', 'test');
        this.apiRequest.clearCache('default');
        await this.apiRequest.request('http://example.org', '', 'test');

        expect(window.fetch.calledTwice).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke fetch when a different cache namespace is used', async function() {
      try {
        await this.apiRequest.request('http://example.org', '', 'test', true);
        await this.apiRequest.request('http://example.org', '', 'test', true, 'test');

        expect(window.fetch.calledTwice).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('purgeCache', function() {
    it('Should clear cache', async function() {
      try {
        await this.apiRequest.request('http://example.org', '', 'test', true);
        this.apiRequest.purgeCache();
        const cache = this.apiRequest.getCacheManager(ApiRequest.DEFAULT_CACHE_NAMESPACE);

        expect(cache.size).to.equal(0);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should clear specific cache', async function() {
      try {
        await this.apiRequest.request('http://example.org', '', 'test', true);
        this.apiRequest.purgeCache(ApiRequest.DEFAULT_CACHE_NAMESPACE);
        const cache = this.apiRequest.getCacheManager(ApiRequest.DEFAULT_CACHE_NAMESPACE);

        expect(cache.size).to.equal(0);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
