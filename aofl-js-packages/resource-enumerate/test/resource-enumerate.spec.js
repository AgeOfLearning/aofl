/* eslint no-invalid-this: "off" */
import {ResourceEnumerate} from '../';
import {CacheManager} from '@aofl/cache-manager';

describe('@aofl/resource-enumerate/src/resource-enumerate', function() {
  beforeEach(function() {
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

    fetchMock.mock('*', '200');
  });

  afterEach(function() {
    const cacheManager = new CacheManager(ResourceEnumerate.NAMESPACE);
    cacheManager.clear();
    fetchMock.restore();
  });

  it('should call production', async function() {
    const config = this.config;
    const resourceEnumerateInstance = new ResourceEnumerate('production');
    await resourceEnumerateInstance.init(this.config);

    expect(config.apis.apins.url).to.be.equal('productionHost');
  });

  it('should call development', async function() {
    const config = this.config;
    const resourceEnumerateInstance = new ResourceEnumerate('development');

    await resourceEnumerateInstance.init(config);
    expect(config.apis.apins.url).to.be.equal('developmentHost');
  });

  it('should call stage', async function() {
    const config = this.config;
    const resourceEnumerateInstance = new ResourceEnumerate('stage');
    await resourceEnumerateInstance.init(config);
    expect(config.apis.apins.url).to.be.equal('stageHost');
  });

  it('should work without variables function', async function() {
    const config = this.config;
    config.apis.apins.developmentVariables = void 0;
    const resourceEnumerateInstance = new ResourceEnumerate('development');
    config.developmentConfig = () => Promise.resolve({
      default(ns, {host}) {
        return 'stageHost';
      }
    });

    await resourceEnumerateInstance.init(config);
    expect(config.apis.apins.url).to.be.equal('stageHost');
  });

  it('should get from cache', async function() {
    const config = this.config;
    const resourceEnumerateInstance = new ResourceEnumerate('production');
    await resourceEnumerateInstance.init(config);
    await resourceEnumerateInstance.get('apins');
    await resourceEnumerateInstance.get('apins');
    const numCalls = fetchMock.calls('/productionHost').length;
    expect(numCalls).to.be.equal(1);
  });

  it('should make network call', async function() {
    const config = this.config;
    const resourceEnumerateInstance = new ResourceEnumerate('production');
    await resourceEnumerateInstance.init(config);
    await resourceEnumerateInstance.get('apins');

    expect(fetchMock.called('/productionHost')).to.be.true;
  });

  it('should make new call when fromCache is false', async function() {
    const config = this.config;
    const resourceEnumerateInstance = new ResourceEnumerate('production');
    await resourceEnumerateInstance.init(config);
    await resourceEnumerateInstance.get('apins', false);
    await resourceEnumerateInstance.get('apins', false);
    const numCalls = fetchMock.calls('/productionHost').length;

    expect(numCalls).to.be.equal(2);
  });

  it('should make new call when invalidateCache return true', async function() {
    const config = this.config;
    config.apis.apins.invalidateCache = () => true;
    const resourceEnumerateInstance = new ResourceEnumerate('production');
    await resourceEnumerateInstance.init(config);
    await resourceEnumerateInstance.get('apins');
    await resourceEnumerateInstance.get('apins');

    const numCalls = fetchMock.calls('/productionHost').length;
    expect(numCalls).to.be.equal(2);
  });

  it('should throw a TypeError when api namespace is undefined', async function() {
    const config = this.config;
    const resourceEnumerateInstance = new ResourceEnumerate('production');
    await resourceEnumerateInstance.init(config);
    try {
      await resourceEnumerateInstance.get('undefined-namespace', false);
    } catch (e) {
      expect(e).to.be.an.instanceOf(TypeError);
    }
  });
});
