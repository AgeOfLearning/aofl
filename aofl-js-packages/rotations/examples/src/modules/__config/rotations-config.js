export default {
  'baseline_id': '1000',
  'conditions': {
    '2': 'price',
    '3': 'homepage_design'
  },
  'qualification_order': {
    '/': ['3'],
    '/subscribe': ['2'],
  },
  'versions': {
    '1000': 'routes',
    '1001': 'routes-price_test_1',
    '1002': 'routes-price_test_2',
    '1003': 'routes-price_test_3',
    '1004': 'routes',
    '1005': 'routes-homepage_design_test',
    '1006': 'routes'
  },
  'weights': {
    '2': {
      '1001': 1,
      '1002': 1,
      '1003': 1,
      '1004': 1
    },
    '3': {
      '1005': 1,
      '1006': 1
    }
  }
};
