import './styles.css';
import './modules/example-component';
import {storeInstance} from '@aofl/store';

setInterval(() => {
  storeInstance.commit({
    namespace: 'preview',
    mutationId: 'setDate',
    payload: Date.now()
  });
}, 0);
