import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import './styles.css';
import './modules/example-component';
import {previewSdo} from './modules/preview-sdo';

setInterval(() => {
  previewSdo.date = Date.now();
}, 5);
