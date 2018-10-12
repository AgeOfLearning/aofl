import {uuid} from '../';

const uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/;

describe('uuid-service', function() {
  it('should generate a uuid like value', function() {
    let uuids = [];

    for (let i = 0; i < 10000; i++) {
      uuids.push(uuidRegex.test(uuid()));
    }

    expect(uuids).to.not.include(false);
  });

  it('should generate unique values', function() {
    let uuids = [];
    let unique = true;

    for (let i = 0; i < 1000; i++) {
      let u = uuid();
      if (uuids.indexOf(u) !== -1) {
        unique = false;
      }
      uuids.push(uuid());
    }

    expect(unique).to.be.true;
  });
});
