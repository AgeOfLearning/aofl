/* eslint no-invalid-this: "off" */
import ApiRequest from '../src/api-request';
describe('@aofl/api-request/src/api-request', function() {
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
      const {request} = this.apiRequest;
      try {
        await request('http://example.org', '', 'test');
        await request('http://example.org', '', 'test');

        expect(window.fetch.calledOnce).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke fetch when cache is disabled', async function() {
      const {request} = this.apiRequest;
      try {
        await request('http://example.org', '', 'test');
        await request('http://example.org', '', 'test', false);

        expect(window.fetch.calledTwice).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke fetch when cache is cleared', async function() {
      try {
        const {request, clearCache} = this.apiRequest;
        await request('http://example.org', '', 'test');
        clearCache('default');
        await request('http://example.org', '', 'test');

        expect(window.fetch.calledTwice).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should invoke fetch when a deffirent cache namespace is used', async function() {
      try {
        const {request} = this.apiRequest;
        await request('http://example.org', '', 'test', true);
        await request('http://example.org', '', 'test', true, 'test');

        expect(window.fetch.calledTwice).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
