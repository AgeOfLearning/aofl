/* eslint no-invalid-this: "off" */
import {Rotations} from '../';

describe('@aofl/rotations/rotation', function() {
  beforeEach(function() {
    this.routeConfig = {
      'routes': [
        {
          'resolve': () => Promise.resolve('routes homepage'), // import('component') in a real app
          'rotation': 'routes',
          'path': '/',
          'dynamic': false,
          'title': 'AofL::Home'
        },
        {
          'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
          'rotation': 'routes',
          'path': '/about',
          'dynamic': false,
          'title': 'AofL::About'
        },
        {
          'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
          'rotation': 'routes',
          'path': '/subscribe',
          'dynamic': false,
          'title': 'AofL::Subscribe'
        }
      ],
      'routes-homepage_design_test': [
        {
          'resolve': () => Promise.resolve('routesB homepage'),
          'rotation': 'routes-homepage_design_test',
          'path': '/',
          'dynamic': false,
          'title': 'AofL::Home',
          'locale': ''
        },
        {
          'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
          'rotation': 'routes-homepage_design_test',
          'path': '/about',
          'dynamic': false,
          'title': 'AofL::About'
        },
        {
          'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
          'rotation': 'routes-homepage_design_test',
          'path': '/subscribe',
          'dynamic': false,
          'title': 'AofL::Subscribe'
        }
      ],
      'routes-price_test_1': [
        {
          'resolve': () => Promise.resolve('routesB homepage'),
          'rotation': 'routes-price_test_1',
          'path': '/',
          'dynamic': false,
          'title': 'AofL::Home',
          'locale': ''
        },
        {
          'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
          'rotation': 'routes-price_test_1',
          'path': '/about',
          'dynamic': false,
          'title': 'AofL::About'
        },
        {
          'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
          'rotation': 'routes-price_test_1',
          'path': '/subscribe',
          'dynamic': false,
          'title': 'AofL::Subscribe'
        }
      ],
      'routes-price_test_2': [
        {
          'resolve': () => Promise.resolve('routesB homepage'),
          'rotation': 'routes-price_test_2',
          'path': '/',
          'dynamic': false,
          'title': 'AofL::Home',
          'locale': ''
        },
        {
          'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
          'rotation': 'routes-price_test_2',
          'path': '/about',
          'dynamic': false,
          'title': 'AofL::About'
        },
        {
          'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
          'rotation': 'routes-price_test_2',
          'path': '/subscribe',
          'dynamic': false,
          'title': 'AofL::Subscribe'
        }
      ],
      'routes-price_test_3': [
        {
          'resolve': () => Promise.resolve('routesB homepage'),
          'rotation': 'routes-price_test_3',
          'path': '/',
          'dynamic': false,
          'title': 'AofL::Home',
          'locale': ''
        },
        {
          'resolve': () => Promise.resolve('routes about'), // import('component') in a real app
          'rotation': 'routes-price_test_3',
          'path': '/about',
          'dynamic': false,
          'title': 'AofL::About'
        },
        {
          'resolve': () => Promise.resolve('routes subscribe'), // import('component') in a real app
          'rotation': 'routes-price_test_3',
          'path': '/subscribe',
          'dynamic': false,
          'title': 'AofL::Subscribe'
        }
      ]
    };
  });
  context('qualifies()', function() {
    beforeEach(function() {
      this.rotationConfig = {
        'conditions': {
          '1': 'boolean_true',
          '2': 'boolean_false',
          '3': 'promise_true',
          '4': 'promise_false'
        },
        'qualification_order': {},
        'versions': {},
        'weights': {}
      };
      this.rotationConditions = {
        boolean_true: () => true,
        boolean_false: () => false,
        promise_true: () => Promise.resolve(true),
        promise_false: () => Promise.resolve(false)
      };
      this.rotation = new Rotations('rotations', this.routeConfig, this.rotationConfig, this.rotationConditions);
    });

    it('Should return true when condition returns boolean true', async function() {
      const qualifies = await this.rotation.qualifies('1');
      expect(qualifies).to.be.true;
    });
    it('Should return false when condition returns boolean false', async function() {
      const qualifies = await this.rotation.qualifies('2');
      expect(qualifies).to.be.false;
    });
    it('Should return true if condition returns a promise that resolves with true', async function() {
      const qualifies = await this.rotation.qualifies('3');
      expect(qualifies).to.be.true;
    });
    it('Should return true if condition returns a promise that resolves with false', async function() {
      const qualifies = await this.rotation.qualifies('4');
      expect(qualifies).to.be.false;
    });
    it('Should return false if condition does\'nt exist', async function() {
      const qualifies = await this.rotation.qualifies('5');
      expect(qualifies).to.be.false;
    });
    it('Should return cached results when called with the same id', async function() {
      await this.rotation.qualifies('1');
      const qualifies = await this.rotation.qualifies('1');
      expect(qualifies).to.be.true;
    });
  });

  context('getQualifyingId()', function() {
    beforeEach(function() {
      this.rotationConfig = {
        'conditions': {
          '1': 'boolean_true',
          '2': 'boolean_false',
          '3': 'promise_true',
          '4': 'promise_false'
        },
        'qualification_order': {},
        'versions': {},
        'weights': {}
      };
      this.rotationConditions = {
        boolean_true: () => true,
        boolean_false: () => false,
        promise_true: () => Promise.resolve(true),
        promise_false: () => Promise.resolve(false)
      };
      this.rotation = new Rotations('rotations', this.routeConfig, this.rotationConfig, this.rotationConditions);
    });

    it('Should return the first qualifying condition Id', async function() {
      const qualifyingId = await this.rotation.getQualifyingId(['1', '2', '3', '4']);
      expect(qualifyingId).to.be.equal('1');
    });

    it('Should return the first qualifying condition Id', async function() {
      const qualifyingId = await this.rotation.getQualifyingId(['4', '3']);
      expect(qualifyingId).to.be.equal('3');
    });

    it('Should throw an error when no conditions qualify', async function() {
      try {
        await this.rotation.getQualifyingId(['2', '4']);
        throw new Error();
      } catch (e) {
        expect(e).to.have.property('message', 'No matching conditions');
      }
    });

    it('Should throw an error when no params are passed', async function() {
      try {
        await this.rotation.getQualifyingId();
        throw new Error();
      } catch (e) {
        expect(e).to.have.property('message', 'No matching conditions');
      }
    });
  });

  context('getVersion()', function() {
    beforeEach(function() {
      this.rotationConfig = {
        'conditions': {
          '1': 'baseline',
          '2': 'price',
          '3': 'homepage_design'
        },
        'qualification_order': {
          '/': ['3', '1'],
          '/about': ['1'],
          '/subscribe': ['2', '1'],
        },
        'versions': {
          '1000': 'routes',
          '1001': 'routes-price_test_1',
          '1002': 'routes-price_test_2',
          '1003': 'routes-price_test_3',
          '1004': 'routes',
          '1005': 'routes-homepage_design_test',
          '1006': 'routes'
        },
        'weights': {
          '1': {
            '1000': 1
          },
          '2': {
            '1001': 1,
            '1002': 1,
            '1003': 1,
            '1004': 1
          },
          '3': {
            '1005': 1,
            '1006': 1
          }
        }
      };
      this.rotationConditions = {
        baseline: () => true,
        price: () => true,
        homepage_design: () => true
      };
      this.rotation = new Rotations('rotations', this.routeConfig, this.rotationConfig, this.rotationConditions);
    });

    it('Should should return a random version depending on qualifyingId', function() {
      const limit = 1000;
      const versions = {
        '1005': 0,
        '1006': 0
      };
      for (let i = 0; i < limit; i++) {
        const version = this.rotation.getVersion('3');
        versions[version] += 1;
      }

      expect(versions['1005']/limit).to.be.within(0.45, 0.55);
      expect(versions['1006']/limit).to.be.within(0.45, 0.55);
    });

    it('Should throw error if qualifyingId does not map to weights', function() {
      const badFn = () => this.rotation.getVersion('5');
      expect(badFn).to.throw();
    });
  });

  context('findRotationRoute()', function() {
    beforeEach(function() {
      this.rotation = new Rotations('rotations', this.routeConfig, {}, {});
    });

    it('Should find matching route', function() {
      const route = this.rotation.findRotationRoute('routes', '/');
      expect(route).to.equal(this.routeConfig.routes[0]);
    });

    it('Should find matching rotation route', function() {
      const route = this.rotation.findRotationRoute('routes-homepage_design_test', '/about');
      expect(route).to.equal(this.routeConfig['routes-homepage_design_test'][1]);
    });

    it('Should throw an error if rotation not defined', function() {
      const badFn = () => this.rotation.findRotationRoute('no-routes', '/');
      expect(badFn).to.throw(Error, 'Rotation not found');
    });

    it('Should throw an error if route does not exist for given rotation', function() {
      const badFn = () => this.rotation.findRotationRoute('routes', '/no-route');
      expect(badFn).to.throw(Error, 'Rotation route not found');
    });
  });

  context('getRoutes()', function() {
    beforeEach(function() {
      this.rotationConfig = {
        'conditions': {
          '1': 'baseline',
          '2': 'price',
          '3': 'homepage_design'
        },
        'qualification_order': {
          '/': ['3', '1'],
          '/about': ['1'],
          '/subscribe': ['2', '1'],
        },
        'versions': {
          '1000': 'routes',
          '1001': 'routes-price_test_1',
          '1002': 'routes-price_test_2',
          '1003': 'routes-price_test_3',
          '1004': 'routes',
          '1005': 'routes-homepage_design_test',
          '1006': 'routes'
        },
        'weights': {
          '1': {
            '1000': 1
          },
          '2': {
            '1001': 1,
            '1002': 1,
            '1003': 1,
            '1004': 1
          },
          '3': {
            '1005': 1,
            '1006': 0
          }
        }
      };
      this.rotationConditions = {
        baseline: () => true,
        price: () => false,
        homepage_design: () => Promise.resolve(true)
      };
      this.rotation = new Rotations('rotations', this.routeConfig, this.rotationConfig, this.rotationConditions);
    });

    it('Should return array of routes', async function() {
      const routes = await this.rotation.getRoutes();
      expect(routes).to.be.an('array');
    });

    it('Should return the same routes after qualification has been cached', async function() {
      const routes = await this.rotation.getRoutes();
      const routes1 = await this.rotation.getRoutes();
      expect(routes1).to.be.eql(routes);
    });
    it('Should return the same routes after qualification has been cached but no longer qualifies', async function() {
      const routes = await this.rotation.getRoutes();
      const rotation = new Rotations('rotations', this.routeConfig, this.rotationConfig, {
        baseline: () => true,
        price: () => false,
        homepage_design: () => Promise.resolve(false)
      });
      const routes1 = await rotation.getRoutes();
      expect(routes1).to.be.eql(routes);
    });

    it('Should return the new routes after qualification has been cached but rotation is removed', async function() {
      const routes = await this.rotation.getRoutes();
      const rotation = new Rotations('rotations', this.routeConfig, {
        'conditions': {
          '1': 'baseline',
          '2': 'price',
        },
        'qualification_order': {
          '/': ['1'],
          '/about': ['1'],
          '/subscribe': ['2', '1'],
        },
        'versions': {
          '1000': 'routes',
          '1001': 'routes-price_test_1',
          '1002': 'routes-price_test_2',
          '1003': 'routes-price_test_3',
          '1004': 'routes',
        },
        'weights': {
          '1': {
            '1000': 1
          },
          '2': {
            '1001': 1,
            '1002': 1,
            '1003': 1,
            '1004': 1
          }
        }
      }, {
        baseline: () => true,
        price: () => false
      });
      const routes1 = await rotation.getRoutes();
      expect(routes1).to.not.be.eql(routes);
    });

    it('Should use base routed when rotation version does not exist', async function() {
      const rotation = new Rotations('rotations', this.routeConfig, {
        'conditions': {
          '1': 'baseline',
          '2': 'price',
          '3': 'homepage_design'
        },
        'qualification_order': {
          '/': ['3', '1'],
          '/about': ['1'],
          '/subscribe': ['2', '1'],
        },
        'versions': {},
        'weights': {
          '1': {
            '1000': 1
          },
          '2': {
            '1001': 1,
            '1002': 1,
            '1003': 1,
            '1004': 1
          },
          '3': {
            '1005': 1,
            '1006': 1
          }
        }
      }, {
        baseline: () => true,
        price: () => false,
        homepage_design: () => true
      });
      const routes = await rotation.getRoutes();
      expect(routes).to.be.eql(this.routeConfig.routes);
    });
  });
});
