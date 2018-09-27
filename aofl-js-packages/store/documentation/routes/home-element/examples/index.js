const storeInstance = new Store();

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

const mapStateProperties = () => {
  const state = storeInstance.getState();
  context.state = state;
  context.count = state.preview.count;
  context.formattedDate = state.preview.$formattedDate;
};

mapStateProperties();
let unsubscribe = storeInstance.subscribe(mapStateProperties);

context.incrementCount = () => {
  const state = storeInstance.getState();

  storeInstance.commit({
    namespace: 'preview',
    mutationId: 'increment',
    payload: state.preview.count
  });
};

setInterval(() => {
  storeInstance.commit({
    namespace: 'preview',
    mutationId: 'setDate',
    payload: Date.now()
  });
}, 0);

context.unsubscribe = () => {
  unsubscribe();
};

context.subscribe = () => {
  unsubscribe = storeInstance.subscribe(mapStateProperties);
};
