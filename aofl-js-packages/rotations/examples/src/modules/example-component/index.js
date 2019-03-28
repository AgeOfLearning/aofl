/* eslint-disable */
import {AoflElement} from '@aofl/web-components/aofl-element';
import template from './template';
import styles from './styles';
import {Rotations} from '@aofl/rotations';
import routesConfig from '../__config/routes-config';
import rotationsConfig from '../__config/rotations-config';
import rotationConditions from '../__config/rotations-conditions';

class ExampleComponent extends AoflElement {
  constructor() {
    super();
    this.routes = {};
    this.originalRoutes = JSON.stringify(routesConfig, null, 2);
    this.rotations = new Rotations('my-rotations', routesConfig, rotationsConfig, rotationConditions);
    let a = 0;
    let b = 0;
    const c = async () => {
      for (let i = 0; i < 1000; i++) {
        this.rotations.cache.clear();
        const routes = await this.rotations.getRoutes();
        this.routes = routes;
        if (routes[0].rotation === 'routes') {
          a++;
        } else {
          b++;
        }
      }
    };
    (async () => {
      await c();
      console.log(a, b);
    })();
  }

  static get is() {
    return 'example-component';
  }

  static get properties() {
    return {
      routes: {type: Object}
    };
  }

  clearCache() {
    this.rotations.cache.clear();
    this.rotations.getRoutes().then((routes) => {
      // console.log(JSON.stringify(routes));
      this.routes = routes;
    });
  }

  refresh() {
    console.log('refresh');
    this.rotations.getRoutes().then((routes) => {
      // console.log(JSON.stringify(routes));
      this.routes = routes;
    });
  }

  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
