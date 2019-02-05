/* eslint no-invalid-this: "off" */
import {ResourceEnumerate} from '../';
import {CacheManager} from '@aofl/cache-manager';

describe('@aofl/resource-enumerate/src/resource-enumerate', function() {
  beforeEach(function() {
    sinon.stub(window, 'fetch')
      .returns(Promise.resolve({
        json: () => Promise.resolve({})
      }));

    this.config = {
      apis: {
        'apins': {
          url: 'productionHost',
          developmentVariables() {
            return {
              host: 'developmentHost'
            };
          },
          stageVariables() {
            return {
              host: 'stageHost'
            };
          }
        }
      },
      developmentConfig: () => Promise.resolve({
        default(ns, {host}) {
          return host;
        }
      }),
      stageConfig: () => Promise.resolve({
        default(ns, {host}) {
          return host;
        }
      })
    };
  });

  afterEach(function() {
    const cacheManager = new CacheManager(ResourceEnumerate.NAMESPACE);
    cacheManager.clear();
    window.fetch.restore();
  });

  it('should call production', async function() {
    try {
      const config = this.config;
      const resourceEnumerateInstance = new ResourceEnumerate('production');
      await resourceEnumerateInstance.init(this.config);

      expect(config.apis.apins.url).to.be.equal('productionHost');
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should call development', async function() {
    try {
      const config = this.config;
      const resourceEnumerateInstance = new ResourceEnumerate('development');

      await resourceEnumerateInstance.init(config);
      expect(config.apis.apins.url).to.be.equal('developmentHost');
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should call stage', async function() {
    try {
      const config = this.config;
      const resourceEnumerateInstance = new ResourceEnumerate('stage');
      await resourceEnumerateInstance.init(config);
      expect(config.apis.apins.url).to.be.equal('stageHost');
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should work without variables function', async function() {
    try {
      const config = this.config;
      config.apis.apins.developmentVariables = void 0;
      const resourceEnumerateInstance = new ResourceEnumerate('development');
      config.developmentConfig = () => Promise.resolve({
        default() {
          return 'stageHost';
        }
      });

      await resourceEnumerateInstance.init(config);
      expect(config.apis.apins.url).to.be.equal('stageHost');
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should get from cache', async function() {
    try {
      const config = this.config;
      const resourceEnumerateInstance = new ResourceEnumerate('production');
      await resourceEnumerateInstance.init(config);
      await resourceEnumerateInstance.get('apins');
      await resourceEnumerateInstance.get('apins');

      expect(window.fetch.calledWith('productionHost')).to.true;
      expect(window.fetch.calledOnce).to.be.true;
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should make network call', async function() {
    try {
      const config = this.config;
      const resourceEnumerateInstance = new ResourceEnumerate('production');
      await resourceEnumerateInstance.init(config);
      await resourceEnumerateInstance.get('apins');

      expect(window.fetch.calledWith('productionHost')).to.true;
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should make new call when fromCache is false', async function() {
    try {
      const config = this.config;
      const resourceEnumerateInstance = new ResourceEnumerate('production');
      await resourceEnumerateInstance.init(config);
      await resourceEnumerateInstance.get('apins', false);
      await resourceEnumerateInstance.get('apins', false);

      expect(window.fetch.calledWith('productionHost')).to.true;
      expect(window.fetch.calledTwice).to.be.true;
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should make new call when invalidateCache return true', async function() {
    try {
      const config = this.config;
      config.apis.apins.invalidateCache = () => true;
      const resourceEnumerateInstance = new ResourceEnumerate('production');
      await resourceEnumerateInstance.init(config);
      await resourceEnumerateInstance.get('apins');
      await resourceEnumerateInstance.get('apins');

      expect(window.fetch.calledWith('productionHost')).to.true;
      expect(window.fetch.calledTwice).to.be.true;
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should throw a TypeError when api namespace is undefined', async function() {
    try {
      const config = this.config;
      const resourceEnumerateInstance = new ResourceEnumerate('production');
      await resourceEnumerateInstance.init(config);
      try {
        await resourceEnumerateInstance.get('undefined-namespace', false);
      } catch (e) {
        expect(e).to.be.an.instanceOf(TypeError);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  });
});
