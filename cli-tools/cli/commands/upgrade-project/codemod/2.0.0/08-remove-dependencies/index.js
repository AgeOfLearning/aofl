const chalk = require('chalk');
const Npm = require('../../../../../lib/npm');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const prodDependencies = [
    ...Object.keys(projectInfo.package.devDependencies).filter((item) => item.indexOf('@aofl/') === 0 && ['@aofl/jsdoc-template', '@aofl/html-webpack-purify-internal-css-plugin'].indexOf(item) === -1),
    'svg-inline-loader',
    'ajv'
  ];
  const dependencies = [
    ...prodDependencies,
    '@aofl/html-webpack-purify-internal-css-plugin',
    '@babel/core',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime',
    '@babel/preset-env',
    '@polymer/lit-element',
    'ajv',
    'autoprefixer',
    'babel-eslint',
    'babel-loader',
    'babel-plugin-istanbul',
    'clean-webpack-plugin',
    'copy-webpack-plugin',
    'css-loader',
    'cssnano',
    'eslint-config-google',
    'eslint-loader',
    'file-loader',
    'hard-source-webpack-plugin',
    'html-webpack-plugin',
    'image-webpack-loader',
    'imagemin',
    'imagemin-gifsicle',
    'imagemin-mozjpeg',
    'imagemin-optipng',
    'imagemin-pngquant',
    'imagemin-svgo',
    'img-loader',
    'imports-loader',
    'istanbul-instrumenter-loader',
    'js-string-escape',
    'lit-element',
    'lit-html',
    'postcss-loader',
    'raw-loader',
    'svg-inline-loader',
    'terser-webpack-plugin',
    'webpack',
    'webpack-cli',
    'webpack-dev-server',
    'webpack-livereload-plugin',
    'webpack-merge',
    'webpack-pwa-manifest',
    'workbox-webpack-plugin'
  ];

  const result = {
    skip: false,
    message: chalk.red(`Removing the following devDependencies as some have moved to @aofl/cli and some will be installed as prod dependencies: \n ${dependencies.join(', ')}\n`),
    label: chalk.cyan(`Removing dependencies`)
  };

  if (commit) {
    await Npm.removeDependency(dependencies, '-D');
    await Npm.installDependency(['eslint-config-aofl'], '-D');
    await Npm.installDependency(prodDependencies, '-S');
  }

  return result;
};
