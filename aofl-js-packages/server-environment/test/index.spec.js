import {environmentTypeEnumerate} from '../modules/environment-type-enumerate';
import {getServerEnvironment} from '../modules/server-environment-service';

describe('@aofl/getServerEnvironment', function() {
  it('should match production if no arguments are passed', function() {
    expect(getServerEnvironment()).to.be.equal(environmentTypeEnumerate.PROD);
  });

  it('should match development if devRegex is a match', function() {
    expect(getServerEnvironment(/./, void(0))).to.be.equal(environmentTypeEnumerate.DEV);
  });

  it('should match stage if stageRegexis a match', function() {
    expect(getServerEnvironment(void(0), /./)).to.be.equal(environmentTypeEnumerate.STAGE);
  });
});
