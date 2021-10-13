const path = require('path');
const {parse, init} = require('es-module-lexer');
const {getOptions} = require('loader-utils');
const {validate} = require('schema-utils');
const {parseClass} = require('./src/parse-class');

const schema = {
  'type': 'object',
  'properties': {
    'cache': {
      'type': 'boolean'
    },
    'decorators': {
      'type': 'array'
    },
    'baseClasses': {
      type: 'array'
    },
    'patch': {
      type: 'object'
    }
  }
};

module.exports = async function(source) {
  const callback = this.async();
  const options = Object.assign({
    cache: true,
    decorators: [],
    baseClasses: [],
    patch: {}
  }, getOptions(this));

  validate(schema, options, {name: 'Aofl HMR Loader'});

  if (options.cache === false) {
    this.cacheable(false);
  }

  if (process.env.NODE_ENV === 'production' || !this.hot) {
    callback(null, source);
    return;
  }
  const additionalPatch = options.patch[this.resourcePath] || '';
  const classInfo = parseClass(source, this.resourcePath);
  const patch = [];

  for (let i = 0; i < classInfo.length; i++) {
    const ci = classInfo[i];
    if (ci.decorators.filter((item) => options.decorators.includes(item)).length) {
      patch.push(ci);
    } else if (ci.heritageClasses.filter((item) => options.baseClasses.includes(item)).length) {
      patch.push(ci);
    }
  }

  await init;
  const [imports] = parse(source);

  if (imports.length > 0) {
    const importPaths = [];
    for (let i = 0; i < imports.length; i++) {
      const res = imports[i];
      const importPath = '\'' + res.n + '\'';
      if (importPaths.indexOf(importPath)) {
        importPaths.push(importPath);
      }
    }

    const ctors = `[${patch.map((item) => item.className).join(', ')}]`;

    const hmrRuntimePath = path.relative(path.dirname(this.resourcePath), path.join(__dirname, 'src', 'wcHmrRuntime.js'));

    if (patch.length === 0) {
      callback(null, source);
      return;
    }
    const tmpSource = `
        import {register as hmrRegister} from '${hmrRuntimePath}';
        ${source}

        ${additionalPatch}

        const ctors = ${ctors};
        for (let i = 0; i < ctors.length; i++) {
          const Ctor = ctors[i];
          hmrRegister(import.meta.url, Ctor.name, Ctor);
        }

        module.hot.accept([${importPaths.join(', ')}], function (deps) {
          for (let i = 0; i < ctors.length; i++) {
            const Ctor = ctors[i];
            hmrRegister(import.meta.url, Ctor.name, Ctor);
          }
        });

        module.hot.accept((err, {moduleId, module}) => {
          console.log('self error', err);
        });

    `;

    source = tmpSource;
  }

  callback(null, source);
};
