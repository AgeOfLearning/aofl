export default {
  'page_rotations': {
    '/': [
      1,
      2,
      4
    ],
    '/login/:new/': [
      4,
      1
    ],
    '/login/': [
      1
    ]
  },
  'rotation_config_root': '\/home\/www-data\/config\/rotation_config',
  'rotation_id_keyname_map': {
    '1': 'routes',
    '2': 'ios',
    '4': 'monthly-test'
  },
  'rotation_pages': {
    '1': ['/', '/login/:new/', 'login/'],
    '2': ['/'],
    '4': ['/']
  },
  'rotation_version_page_group_version_map': {
    '5000': 'routes',
    '6000': 'ios',
    '7000': 'monthly-test'
  },
  'rotation_versions': {
    '1': {
      '5000': '1',
      '7000': '1'
    },
    '2': {
      '6000': '1',
      '7000': '1'
    },
    '4': {
      '5000': '1'
    }
  }
};
