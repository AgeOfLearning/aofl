/* eslint no-invalid-this: "off" */
import {Rotations} from '../';

describe('@aofl/rotations/rotation', function() {
  context('Methods', function() {
    beforeEach(function() {
      this.routeConfig = {
        'routes': [
          {
            'resolve': () => fetch('./routes/home/index.js'),
            'rotation': 'routes',
            'path': '/home'
          },
          {
            'resolve': () => fetch('./routes/login/index.js'),
            'rotation': 'routes',
            'path': '/login'
          }
        ],
        'routes-b': [
          {
            'resolve': () => fetch('./routes-b/home-b/index.js  '),
            'rotation': 'routes-b',
            'path': '/home'
          },
          {
            'resolve': () => fetch('./routes/login/index.js'),
            'rotation': 'routes-b',
            'path': '/login'
          }
        ]
      };
      this.rotationsConfig = {
        'page_rotations': {
          '/': [1, 2],
          '/about': [1, 2],
          '/contact': [2, 1]
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
            '1000': '3',
            '2000': '1'
          },
          '2': {
            '1000': '1',
            '2000': '1'
          }
        }
      };
      this.rotationConditions = {
        'routes': () => false,
        'routes-b': () => true
      };
    });

    it('"getWeightsTotal()" should return the correct sum of weights', function() {
      const rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      const total = rotations.getWeightsTotal(this.rotationsConfig['rotation_versions']['1']);
      expect(total).to.equal(4);
    });

    it('"createVersionRanges" should create the correct weight based pct ranges', function() {
      const rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      const versions = rotations.createVersionRanges(this.rotationsConfig['rotation_versions']['1']);
      expect(versions[0].range).to.equal(75);
      expect(versions[1].range).to.equal(100);
    });

    it('"createVersionRanges" should not mutate versions argument', function() {
      const rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      const originalVersions = Object.assign({}, this.rotationsConfig['rotation_versions']['1']);
      rotations.createVersionRanges(this.rotationsConfig['rotation_versions']['1']);
      expect(this.rotationsConfig['rotation_versions']['1']).to.eql(originalVersions);
    });

    it('"chooseWeightedVariant()" should select rotations based on weighted distribution', function() {
      const rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      let routesCount = 0;
      const limit = 500;
      for (let i = 0; i < limit; i++) {
        const version = rotations.chooseWeightedVariant('1');
        if (version === '1000') routesCount++;
      }
      expect(routesCount/limit).to.be.within(0.65, 0.85);
    });

    it('"replaceRoute()" should replace routes correctly', function() {
      const rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      const routes = rotations.replaceRoute(this.routeConfig.routes, 'routes-b', '/login');
      expect(routes[1].rotation).to.equal('routes-b');
    });

    it('"getQualifyingRotation()" should qualify in the correct order', async function() {
      try {
        const rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
        const selectedRotationId = await rotations.getQualifyingRotation({path: '/about'});
        expect(selectedRotationId).to.equal(2);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('"uniqueRoutes()" should provide unique routes', function() {
      const rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
      const routes = rotations.uniqueRoutes();
      expect(routes.length).to.equal(2);
    });
  });
  context('No Match', function() {
    beforeEach(function() {
      this.routeConfig = {
        'routes': [
          {
            'resolve': () => fetch('./routes/home/index.js'),
            'rotation': 'routes',
            'path': '/home'
          },
          {
            'resolve': () => fetch('./routes/login/index.js'),
            'rotation': 'routes',
            'path': '/login'
          }
        ],
        'routes-b': [
          {
            'resolve': () => fetch('./routes-b/home-b/index.js  '),
            'rotation': 'routes-b',
            'path': '/home'
          },
          {
            'resolve': () => fetch('./routes/login/index.js'),
            'rotation': 'routes-b',
            'path': '/login'
          }
        ]
      };
      this.rotationsConfig = {
        'page_rotations': {
          '/': [1, 2],
          '/about': [1, 2],
          '/contact': [2, 1]
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
        'routes': () => false,
        'routes-b': () => true
      };
    });

    it('Should return the defualt routes with no matched rotations', async function() {
      try {
        const rotations = new Rotations('my-rotations-c', this.routeConfig, this.rotationsConfig, this.rotationConditions);
        const routes = await rotations.getRoutes();
        expect(routes[0].rotation).to.equal('routes'); // default
        expect(routes).to.eql(this.routeConfig.routes);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should handle empty routeConfig, returning empty array without error', async function() {
      try {
        const rotations = new Rotations('my-rotations-c', {}, this.rotationsConfigOne, this.rotationConditionsFirstFalse);
        const routes = await rotations.getRoutes();
        expect(routes).to.be.a('array');
        expect(routes).to.have.lengthOf(0);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  context('Weights are respected', function() {
    beforeEach(function() {
      this.routeConfig = {
        'routes': [
          {
            'resolve': () => fetch('./routes/home/index.js'),
            'rotation': 'routes',
            'path': '/'
          }
        ],
        'routes-b': [
          {
            'resolve': () => fetch('./routes-b/home-b/index.js'),
            'rotation': 'routes-b',
            'path': '/'
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
        'routes': () => new Promise((resolve) => resolve(true)),
        'routes-b': () => true
      };
    });

    it('Should generate routes-b ~33%  of the time', async function() {
      try {
        await new Promise((resolve) => {
          const rotations = new Rotations('my-rotations-a2', this.routeConfig, this.rotationsConfig, this.rotationConditions);
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
                resolve();
              }
            });
          };
          genRoutes();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should generate routes-b 100%', async function() {
      try {
        await new Promise((resolve) => {
          const limit = 20;
          const promises = [];
          let i = 0;
          const matches = {'routes': 0, 'routes-b': 0};
          const rotationsConfig = {
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
                '1000': '0',
                '2000': '1'
              },
              '2': {
                '1000': '0',
                '2000': '1'
              }
            }
          };

          let rotations;
          const interval = setInterval(() => {
            if (i++ === limit) {
              clearInterval(interval);
              Promise.all(promises).then(() => {
                expect(matches.routes).to.equal(0);
                expect(matches['routes-b'] / limit).to.equal(1);
                resolve();
              });
            } else {
              if (rotations) rotations.clearCache();
              rotations = new Rotations('my-rotations-' + i, this.routeConfig, rotationsConfig, this.rotationConditions);

              const p = rotations.getRoutes();
              promises.push(p);
              p.then((routes) => {
                matches[routes[0].rotation] += 1;
              });
            }
          }, 10);
        });
      } catch (e) {
        return Promise.reject(e);
      }
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
        'routes': () => true,
        'routes-b': () => new Promise((resolve) => resolve(true))
      };
    });

    beforeEach(function() {
      window.aofljsConfig = {
        prerender: false
      };
    });

    it('Should generate the original routes on prerender true', async function() {
      try {
        await new Promise((resolve) => {
          window.aofljsConfig = {
            prerender: true
          };

          const rotations = new Rotations('my-rotations-b', this.routeConfig, this.rotationsConfig, this.rotationConditions);
          rotations.getRoutes().then((routes) => {
            expect(routes).to.be.a('array');
            expect(routes).to.have.lengthOf(3);
            resolve();
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('Should serve a cached route', async function() {
      try {
        await new Promise((resolve) => {
          const rotations = new Rotations('my-rotations-d', this.routeConfig, this.rotationsConfig, this.rotationConditions);
          rotations.getRoutes().then((origRoutes) => {
            rotations.getRoutes().then((routes) => {
              expect(routes).have.lengthOf(3);
              expect(routes).to.be.a('array');
              expect(routes).to.eql(origRoutes);
              resolve();
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
});
