import {storeInstance} from '@aofl/store';
import {deepAssign} from '@aofl/object-utils';

const sdo = {
  namespace: 'preview',
  mutations: {
    init() {
      return {
        count: 0,
        date: Date.now()
      };
    },
    increment(subState, count) {
      return Object.assign({}, subState, {
        count: count + 1
      });
    },
    setDate(subState, date) {
      return Object.assign({}, subState, {
        date
      });
    }
  },
  decorators: [
    (_nextState) => {
      const state = storeInstance.getState();
      let nextState = _nextState;

      if (
        typeof nextState.preview.$formattedDate === 'undefined' ||
        state.preview.date !== nextState.preview.date
      ) {
        const config = {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        nextState = deepAssign(_nextState, 'preview', {
          $formattedDate: new Date(_nextState.preview.date).toLocaleDateString('en-US', config)
        });
      }

      return nextState;
    }
  ]
};

storeInstance.addState(sdo);
