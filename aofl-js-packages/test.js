const {deepAssign} = require('./object-utils/modules/deep-assign');

// const data = {
//   prop1: '',
//   prop2: {
//     prop1: true
//   },
//   prop3: {
//     prop1: {
//       prop1: {
//         prop1: {

//         }
//       },
//       prop2: {

//       }
//     }
//   }
// };

// const newData = deepAssign(data, '', {
//   prop4: {}
// });

// console.log(newData);

const state = {
  sidePanels: {
    left: {
      active: false,
      offCanvas: false
    },
    right: {
      active: false,
      offCanvas: false
    }
  }
};

const overlay = {
  $overlay: true
};

const s = deepAssign(state, 'sidePanels', overlay);

console.log(s);
