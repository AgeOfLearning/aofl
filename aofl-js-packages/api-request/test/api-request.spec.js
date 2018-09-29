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
    fetchMock.mock('http://example.org', 200);
    this.apiRequest = new ApiRequest();
    this.apiRequest.addFormatter('test', this.formatter);
  });

  afterEach(function() {
    this.apiRequest.clearCache('default');
    fetchMock.restore();
  });

  context('request()', function() {
    it('should make a network call to specified url', function() {
      this.apiRequest.request('http://example.org', '', 'test');

      expect(fetchMock.called('http://example.org')).to.be.true;
    });

    it('should return cached result', function(done) {
      const apiRequest = this.apiRequest;
      apiRequest.request('http://example.org', '', 'test')
      .then(() => {
        apiRequest.request('http://example.org', '', 'test')
        .then(() => {
          const numCalls = fetchMock.calls('http://example.org').length;
          expect(numCalls).to.be.equal(1);
          done();
        });
      });
    });

    it('should invoke fetch when cache is disabled', function(done) {
      const apiRequest = this.apiRequest;
      apiRequest.request('http://example.org', '', 'test')
      .then(() => {
        apiRequest.request('http://example.org', '', 'test', false)
        .then(() => {
          const numCalls = fetchMock.calls('http://example.org').length;
          expect(numCalls).to.be.equal(2);
          done();
        });
      });
    });

    it('should invoke fetch when cache is cleared', function(done) {
      const apiRequest = this.apiRequest;
      apiRequest.request('http://example.org', '', 'test')
      .then(() => {
        apiRequest.clearCache('default');
        apiRequest.request('http://example.org', '', 'test')
        .then(() => {
          const numCalls = fetchMock.calls('http://example.org').length;
          expect(numCalls).to.be.equal(2);
          done();
        });
      });
    });

    it('should invoke fetch when a deffirent cache namespace is used', function(done) {
      const apiRequest = this.apiRequest;
      apiRequest.request('http://example.org', '', 'test', true)
      .then(() => {
        apiRequest.request('http://example.org', '', 'test', true, 'test')
        .then(() => {
          const numCalls = fetchMock.calls('http://example.org').length;
          expect(numCalls).to.be.equal(2);
          done();
        });
      });
    });
  });
});
