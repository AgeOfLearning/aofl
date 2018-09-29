/* eslint no-invalid-this: "off" */
import {Rotations} from '../';

describe('@aofl/rotations/rotation', function() {
  context('No Match', function() {
    beforeEach(function() {
      this.routeConfig = {
        'routes': [
          {
            'resolve': () => fetch('./routes/home/index.js'),
            'rotation': 'routes',
            'path': '/home'
          }
        ],
        'routes-b': [
          {
            'resolve': () => fetch('./routes-b/home-b/index.js'),
            'rotation': 'routes-b',
            'path': '/home'
          }
        ]
      };
      this.rotationsConfig = {
        'page_rotations': {
          '/': [1, 2]
        },
        'rotation_id_keyname_map': {
          '1': 'routes',
          '2': 'routes-b'
        },
        'rotation_version_page_group_version_map': {
          '1000': 'routes',
          '2000': 'routes-b'
        },
        'rotation_versions': {
          '1': {
            '1000': '2',
            '2000': '1'
          },
          '2': {
            '1000': '1',
            '2000': '1'
          }
        }
      };
      this.rotationConditions = {
        'routes': (resolve, reject) => {
          resolve(false);
        },
        'routes-b': (resolve, reject) => {
          resolve(true);
        }
      };
    });

    it('Should return the defualt routes with no matched rotations', function(done) {
      let rotations = new Rotations('my-rotations-c', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      rotations.getRoutes().then((routes) => {
        expect(routes).to.have.lengthOf(1);
        expect(routes[0].rotation).to.equal('routes'); // default
        expect(routes).to.eql(this.routeConfig.routes);
        expect(routes).to.be.a('array');
        done();
      });
    });
    it('Should handle empty routeConfig, returning empty array without error', function(done) {
      let rotations = new Rotations('my-rotations-c', {}, this.rotationsConfigOne, this.rotationConditionsFirstFalse);
      rotations.getRoutes().then((routes) => {
        expect(routes).to.be.a('array');
        expect(routes).to.have.lengthOf(0);
        done();
      });
    });
  });

  context('Weights are respected', function() {
    beforeEach(function() {
      this.routeConfig = {
        'routes': [
          {
            'resolve': () => fetch('./routes/home/index.js'),
            'rotation': 'routes',
            'path': '/home'
          }
        ],
        'routes-b': [
          {
            'resolve': () => fetch('./routes-b/home-b/index.js'),
            'rotation': 'routes-b',
            'path': '/home'
          }
        ]
      };
      this.rotationsConfig = {
        'page_rotations': {
          '/': [1, 2]
        },
        'rotation_id_keyname_map': {
          '1': 'routes',
          '2': 'routes-b'
        },
        'rotation_version_page_group_version_map': {
          '1000': 'routes',
          '2000': 'routes-b'
        },
        'rotation_versions': {
          '1': {
            '1000': '2',
            '2000': '1'
          },
          '2': {
            '1000': '1',
            '2000': '1'
          }
        }
      };
      this.rotationConditions = {
        'routes': (resolve, reject) => {
          resolve(false);
        },
        'routes-b': (resolve, reject) => {
          resolve(true);
        }
      };
    });

    it('Should generate routes-b ~33% of the time', function(done) {
      let rotations = new Rotations('my-rotations-a2', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      let totalCount = 0;
      let routesBCount = 0;

      const genRoutes = () => {
        rotations.clearCache();
        rotations.getRoutes().then((routes) => {
          expect(routes).to.be.a('array');
          // expect(routes.rotation).to.equal('routes-b');
          if (routes.rotation === 'routes-b') {
            routesBCount++;
          }
          if (totalCount++ < 100) {
            genRoutes();
          } else {
            // we're all done
            expect(Math.abs(routesBCount/100 - .33)).to.be.within(.28, .38);
            done();
          }
        });
      };
      genRoutes();
    });
  });
  context('Cache / Prerender', function() {
    beforeEach(function() {
      this.routeConfig = {
        'routes': [
          {
            'resolve': () => fetch('./routes/about/index.js'),
            'rotation': 'routes',
            'path': '/about'
          },
          {
            'resolve': () => fetch('./routes/home/index.js'),
            'rotation': 'routes',
            'path': '/'
          },
          {
            'resolve': () => fetch('./routes/contact/index.js'),
            'rotation': 'routes',
            'path': '/contact'
          }
        ],
        'routes-b': [
          {
            'resolve': () => fetch('./routes-b/about-b/index.js'),
            'rotation': 'routes-b',
            'path': '/about'
          },
          {
            'resolve': () => fetch('./routes/home/index.js'),
            'rotation': 'routes',
            'path': '/'
          },
          {
            'resolve': () => fetch('./routes/contact-us/index.js'),
            'rotation': 'routes',
            'path': '/contact-us'
          }
        ]
      };
      this.rotationsConfig = {
        'page_rotations': {
          '/': [1, 2],
          '/about': [2, 1],
          '/contact-us': [1, 2]
        },
        'rotation_id_keyname_map': {
          '1': 'routes',
          '2': 'routes-b'
        },
        'rotation_version_page_group_version_map': {
          '1000': 'routes',
          '2000': 'routes-b'
        },
        'rotation_versions': {
          '1': {
            '1000': '2',
            '2000': '1'
          },
          '2': {
            '1000': '1',
            '2000': '1'
          }
        }
      };
      this.rotationConditions = {
        'routes': (resolve, reject) => {
          resolve(true);
        },
        'routes-b': (resolve, reject) => {
          resolve(true);
        }
      };
    });

    beforeEach(function() {
      window.aofljsConfig = {
        prerender: false
      };
    });

    it('Should generate the original routes on prerender true', function(done) {
      window.aofljsConfig = {
        prerender: true
      };

      let rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      rotations.getRoutes().then((routes) => {
        expect(routes).to.be.a('array');
        expect(routes).to.have.lengthOf(3);
        done();
      });
    });
    it('Should serve a cached route', function(done) {
      // Allows for in loops to be properly covered
      /*eslint-disable */
      Object.prototype.versions = true;
      Object.prototype.routeConfig = true;

      let rotations = new Rotations('my-rotations-d', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      rotations.getRoutes().then((origRoutes) => {
        rotations.getRoutes().then((routes) => {
          expect(routes).have.lengthOf(3);
          expect(routes).to.be.a('array');
          expect(routes).to.eql(origRoutes);
          done();
        });
      });
    });
  });
});
