import {storeInstance} from '@aofl/store';

const sdo = {
  namespace: 'color',
  mutations: {
    init() {
      return {
        color: 'gold'
      };
    },
    setColor(subState, color) {
      return Object.assign({}, subState, {color});
    }
  }
};

storeInstance.addState(sdo);
