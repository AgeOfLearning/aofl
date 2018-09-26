/* eslint no-invalid-this: "off" */
import {ResourceEnumerate} from '../../';
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
      developmentRegex: /no-match/,
      stageRegex: /no-match/,
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

    this.resourceEnumerateInstance = new ResourceEnumerate();
  });

  beforeEach(function() {
    fetchMock.mock('productionHost', {});
    fetchMock.mock('stageHost', {});
    fetchMock.mock('developmentHost', {});
  });

  afterEach(function() {
    const cacheManager = new CacheManager(ResourceEnumerate.NAMESPACE);
    cacheManager.clear();
    fetchMock.restore();
  });

  it('should call production', function(done) {
    const config = this.config;
    this.resourceEnumerateInstance.init(this.config)
    .then(() => {
      expect(config.apis.apins.url).to.be.equal('productionHost');
      done();
    });
  });

  it('should call development', function(done) {
    const config = this.config;
    config.developmentRegex = /./;
    this.resourceEnumerateInstance.init(config)
    .then(() => {
      expect(config.apis.apins.url).to.be.equal('developmentHost');
      done();
    });
  });

  it('should call stage', function(done) {
    const config = this.config;
    config.stageRegex = /./;
    this.resourceEnumerateInstance.init(config)
    .then(() => {
      expect(config.apis.apins.url).to.be.equal('stageHost');
      done();
    });
  });

  it('should work without variables function', function(done) {
    const config = this.config;
    config.apis.apins.developmentVariables = void 0;
    config.developmentRegex = /./;
    config.developmentConfig = () => Promise.resolve({
      default(ns, {host}) {
        return 'stageHost';
      }
    });

    this.resourceEnumerateInstance.init(config)
    .then(() => {
      expect(config.apis.apins.url).to.be.equal('stageHost');
      done();
    });
  });

  it('should get from cache', function(done) {
    const config = this.config;
    this.resourceEnumerateInstance.init(config)
    .then(() => {
      this.resourceEnumerateInstance
      .get('apins')
      .then(() => {
        this.resourceEnumerateInstance
        .get('apins')
        .then((payload) => {
          const numCalls = fetchMock.calls('productionHost').length;

          expect(numCalls).to.be.equal(1);
          done();
        });
      });
    });
  });

  it('should make network call', function(done) {
    const config = this.config;
    this.resourceEnumerateInstance.init(config)
    .then(() => {
      this.resourceEnumerateInstance
      .get('apins')
      .then((payload) => {
        expect(fetchMock.called('productionHost')).to.be.true;
        done();
      });
    });
  });

  it('should make new call when fromCache is false', function(done) {
    const config = this.config;
    this.resourceEnumerateInstance.init(config)
    .then(() => {
      this.resourceEnumerateInstance
      .get('apins', false)
      .then((payload) => {
        this.resourceEnumerateInstance
        .get('apins', false)
        .then(() => {
          const numCalls = fetchMock.calls('productionHost').length;

          expect(numCalls).to.be.equal(2);
          done();
        });
      });
    });
  });

  it('should make new call when invalidateCache return true', function(done) {
    const config = this.config;
    config.apis.apins.invalidateCache = () => true;

    this.resourceEnumerateInstance.init(config)
    .then(() => {
      this.resourceEnumerateInstance
      .get('apins')
      .then((payload) => {
        this.resourceEnumerateInstance
        .get('apins')
        .then(() => {
          const numCalls = fetchMock.calls('productionHost').length;

          expect(numCalls).to.be.equal(2);
          done();
        });
      });
    });
  });

  it('should throw a TypeError when api namespace is undefined', function(done) {
    const config = this.config;
    this.resourceEnumerateInstance.init(config)
    .then(() => {
      this.resourceEnumerateInstance
      .get('undefined-namespace', false)
      .catch((e) => {
        expect(e).to.be.an.instanceOf(TypeError);
        done();
      });
    });
  });
});
