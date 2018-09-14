/* eslint-disable */
context.response = null;
context.environment = 'production';

const resourceEnumerateConfig = {
  apis: {
    'awesome-apis': {
      url: '/apis/v1.0/resource-enumerate.json'
    }
  },
  developmentRegex: /./, // match anything for demo purpose
  stageRegex: /no-match/,
  developmentConfig: () => Promise.resolve({
    default(apiNs) {
      context.environment = 'local';
      return `//${location.host}/apis/dev/v1.0/resource-enumerate.json`;
    }
  }),
  stageConfig: () => Promise.resolve({
    default(apiNs) {
      context.environment = 'stage';
      return `//${location.host}/apis/stage/v1.0/resource-enumerate.json`;
    }
  })
};

const resourceEnumerateInstance = new ResourceEnumerate();
resourceEnumerateInstance.init(resourceEnumerateConfig)
.then(() => {
  resourceEnumerateInstance.get('awesome-apis')
  .then((response) => {
    context.response = response;
  })
});
