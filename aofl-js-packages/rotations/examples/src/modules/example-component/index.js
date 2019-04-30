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

    this.rotations.cache.clear();
    this.rotations.getRoutes()
    .then((routes) => {
      this.routes = routes;
    });
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
      this.routes = routes;
    });
  }

  refresh() {
    this.rotations.getRoutes().then((routes) => {
      this.routes = routes;
    });
  }

  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
