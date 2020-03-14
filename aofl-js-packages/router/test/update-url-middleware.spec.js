/* eslint no-invalid-this: "off" */
import {updateUrlMiddleware} from '../modules/update-url-middleware';
import {expect} from 'chai';

describe('@aofl/router/update-url-middleware', function() {
  it('Should throw call next with error', function() {
    updateUrlMiddleware({}, {to: Object}, (response, err) => {
      expect(err).not.be.null;
    });
  });
});
