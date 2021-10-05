const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');
const esm = require('esm');
// const parseRoute = require('../parse-route');

const DEFAULT_ROTATION = 'routes';
const TRAILING_PATH_SEP_REGEX = new RegExp('\\' + path.sep + '$');
const TRAILING_SLASH_REGEX = /\/$/;
const LEADING_SLASH_REGEX = /^\//;
const ALT_ROUTES_REGEX = /\/routes-([^/]+?)\//;

const getRoutePatterns = (pattern) => {
  if (pattern instanceof RegExp) {
    return [pattern];
  }
  return pattern;
};

const parseRouteFile = async (file, options) => {
  const routeFile = esm(module)(path.resolve(file));
  return routeFile.routes.map((item, index) => {
    const parsedData = Object.assign({}, {
      route: '',
      title: '',
      metaTags: [],
      linkTags: [],
      mata: {},
      locale: '',
      prerender: false
    }, item);

    const routePath = parsedData.path.replace(/:.*/, '').replace(TRAILING_SLASH_REGEX, '') + '/';

    return {
      index,
      url: parsedData.path,
      path: routePath,
      routeOutputName: (routePath + 'index.html').replace(LEADING_SLASH_REGEX, ''),
      dynamic: parsedData.path !== routePath,
      title: parsedData.title,
      prerender: parsedData.prerender,
      metaTags: parsedData.metaTags.reduce((acc, item) => {
        acc += `<meta`;
        for (const key in item) {
          if (!item.hasOwnProperty(key)) continue;
          acc += ` ${key}="${item[key]}"`;
        }
        acc += '>\n';
        return acc;
      }, ''),
      linkTags: parsedData.linkTags.reduce((acc, item) => {
        acc += `<link`;
        for (const key in item) {
          if (!item.hasOwnProperty(key)) continue;
          acc += ` ${key}="${item[key]}"`;
        }
        acc += '>\n';
        return acc;
      }, ''),
      meta: parsedData.meta,
      locale: parsedData.locale || options.locale,
      template: options.template.name
    };
  });
};

const getRotation = (file) => {
  const altRoutesMatches = file.match(ALT_ROUTES_REGEX);
  if (altRoutesMatches !== null) {
    return altRoutesMatches[1];
  }
  return DEFAULT_ROTATION;
};

module.exports = async (options, context = process.cwd()) => {
  const routeAssets = [];
  const routeFiles = await glob(getRoutePatterns(options.routes.pattern), {
    ignore: options.routes.ignore
  });

  for (let i = 0; i < routeFiles.length; i++) {
    const routeFile = path.resolve(routeFiles[i]);
    const isMainRoute = routeFile.indexOf(options.routes.mainRoutes.replace(TRAILING_PATH_SEP_REGEX, '') + path.sep) > -1;
    const rotation = getRotation(routeFile);

    if (!isMainRoute && rotation === DEFAULT_ROTATION) {
      continue; // not route and not rotation??? whit is it?
    }

    const routes = await parseRouteFile(routeFile, options);
    for (let i = 0; i < routes.length; i++) {
      const routeInfo = routes[i];
      if (typeof routeInfo.url === 'undefined' || routeInfo.url === '') {
        continue; // invalid route config
      }

      routeAssets.push({
        index: routeInfo.index,
        dependencyPath: routeFile,
        outputName: routeInfo.routeOutputName,
        partialName: 'main',
        rotation,
        metaTags: routeInfo.metaTags,
        linkTags: routeInfo.linkTags,
        prerender: routeInfo.prerender,
        routeConfig: {
          rotation,
          path: (options.publicPath.replace(TRAILING_SLASH_REGEX, '') + '/' + routeInfo.url.replace(LEADING_SLASH_REGEX, '').replace(TRAILING_SLASH_REGEX, '') + '/').replace(new RegExp('//', 'g'), '/'),
          dynamic: routeInfo.dynamic,
          title: routeInfo.title,
          meta: routeInfo.meta,
          locale: routeInfo.locale,
          template: routeInfo.template
        }
      });
    }
  }

  return routeAssets;
};
