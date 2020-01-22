/* eslint no-invalid-this: "off" */
import {expect} from 'chai';
import {PathUtils} from '../modules/path-utils';

describe('@aofl/router/modules/path-utils', function() {
  it('Should remove # from path', function() {
    expect(PathUtils.cleanPath('/test#hash')).to.equal('/test');
  });
  it('Should remove ? from path', function() {
    expect(PathUtils.cleanPath('/test?key=val')).to.equal('/test');
  });
  it('Should remove trailing slash', function() {
    expect(PathUtils.removeTrailingSlash('/test/')).to.equal('/test');
  });
  it('Should remove trailing slash unless path is root', function() {
    expect(PathUtils.removeTrailingSlash('/')).to.equal('/');
  });
  it('Should remove leading slash', function() {
    expect(PathUtils.removeLeadingSlash('/test/')).to.equal('test/');
  });
  it('Should remove leading slash unless path is root', function() {
    expect(PathUtils.removeLeadingSlash('/')).to.equal('/');
  });
  it('Should return path segments', function() {
    expect(PathUtils.getPathSegments('/test/seg/ment/')).to.eql(['test', 'seg', 'ment']);
  });
  it('Should detect dynamic segment', function() {
    expect(PathUtils.isDynamicSegment('/test/:dynamic/')).to.be.true;
  });
  it('Should detect dynamic segment (negative)', function() {
    expect(PathUtils.isDynamicSegment('/test/notdynamic/')).to.be.false;
  });
});
