import {Polyfill} from '@aofl/polyfill-service';
import polyfills from '../__config/polyfills';

const polyfill = new Polyfill(polyfills);
polyfill.loadAll();
