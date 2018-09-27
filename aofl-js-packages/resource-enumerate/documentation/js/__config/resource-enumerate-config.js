const resourceEnumerateConfig = {
  apis: {
    'awesome-apis': {
      url: '/apis/v1.0/resource-enumerate.json',
      requestOptions: {
        cache: 'no-cache'
      },
      developmentVariables() {
        return {
          hostname: location.host
        };
      },
      stageVariables() {
        return {
          hostname: location.host
        };
      },
      invalidateCache() {
        return false;
      }
    },
    'awesome-apis2': {
      url: '/apis/v1.0/stage/resource-enumerate.json',
      requestOptions: {
        cache: 'no-cache'
      },
      developmentVariables() {
        return {
          hostname: location.host
        };
      },
      stageVariables() {
        return {
          hostname: location.host
        };
      },
      invalidateCache() {
        return false;
      }
    }
  },
  developmentRegex: /localhost/,
  stageRegex: /172\.(1[6-9]|2[0-9]|3[01])\.[\d|\.]+/,
  developmentConfig: () => import('./local-api-config'),
  stageConfig: () => import('./stage-api-config')
};

export default resourceEnumerateConfig;
