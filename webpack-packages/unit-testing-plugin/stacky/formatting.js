/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 *
 * This code may only be used under the BSD style license found at polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also subject to
 * an additional IP rights grant found at polymer.github.io/PATENTS.txt
 */
(function(scope) {
  'use strict';

  const parse = scope.parse || require('./parsing').parse;

  scope.defaults = {
  // Methods are aligned up to this much padding.
    maxMethodPadding: 40,
    // A string to prefix each line with.
    indent: '',
    // A string to show for stack lines that are missing a method.
    methodPlaceholder: '<unknown>',
    // A list of Strings/RegExps that will be stripped from `location` values on
    // each line (via `String#replace`).
    locationStrip: [],
    // A list of Strings/RegExps that indicate that a line is *not* important, and
    // should be styled as such.
    unimportantLocation: [],
    // A filter function to completely remove lines
    filter() { return false; },
    // styles are functions that take a string and return that string when styled.
    styles: {
      method: passthrough,
      location: passthrough,
      line: passthrough,
      column: passthrough,
      unimportant: passthrough,
    },
  };

  // See Tero Tolonen's answer at
  // http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
  /* jshint -W054 */
  const isNode = new Function('try {return this===global;}catch(e){return false;}'); // eslint-disable-line

  // For Stacky-in-Node, we default to colored stacks.
  if (isNode()) {
    const chalk = require('chalk');

    scope.defaults.styles = {
      method: chalk.magenta,
      location: chalk.blue,
      line: chalk.cyan,
      column: chalk.cyan,
      unimportant: chalk.dim
    };
  }


  function pretty(stackOrParsed, options) {
    options = mergeDefaults(options || {}, scope.defaults);
    let lines = Array.isArray(stackOrParsed) ? stackOrParsed : parse(stackOrParsed);
    lines = clean(lines, options);

    const padSize = methodPadding(lines, options);
    const parts = lines.map(function(line) {
      const method = line.method || options.methodPlaceholder;
      const pad = options.indent + padding(padSize - method.length);

      const locationBits = [
        options.styles.location(line.location),
        options.styles.line(line.line),
      ];
      if ('column' in line) {
        locationBits.push(options.styles.column(line.column));
      }
      const location = locationBits.join(':');

      let text = pad + options.styles.method(method) + ' at ' + location;
      if (!line.important) {
        text = options.styles.unimportant(text);
      }
      return text;
    });

    return parts.join('\n');
  }

  function clean(lines, options) {
    const result = [];
    for (let i = 0, line; line = lines[i]; i++) { // eslint-disable-line
      if (options.filter(line)) continue;
      line.location = cleanLocation(line.location, options);
      line.important = isImportant(line, options);
      result.push(line);
    }

    return result;
  }

  // Utility

  function passthrough(string) {
    return string;
  }

  function mergeDefaults(options, defaults) {
    const result = Object.create(defaults);
    Object.keys(options).forEach(function(key) {
      let value = options[key];
      if (typeof value === 'object' && !Array.isArray(value)) {
        value = mergeDefaults(value, defaults[key]);
      }
      result[key] = value;
    });
    return result;
  }

  function methodPadding(lines, options) {
    let size = options.methodPlaceholder.length;
    for (let i = 0, line; line = lines[i]; i++) { // eslint-disable-line
      size = Math.min(options.maxMethodPadding, Math.max(size, line.method.length));
    }
    return size;
  }

  function padding(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result = result + ' ';
    }
    return result;
  }

  function cleanLocation(location, options) {
    if (options.locationStrip) {
      for (let i = 0, matcher; matcher = options.locationStrip[i]; i++) { // eslint-disable-line
        location = location.replace(matcher, '');
      }
    }

    return location;
  }

  function isImportant(line, options) {
    if (options.unimportantLocation) {
      for (let i = 0, matcher; matcher = options.unimportantLocation[i]; i++) { // eslint-disable-line
        if (line.location.match(matcher)) return false;
      }
    }

    return true;
  }

  scope.clean = clean;
  scope.pretty = pretty;
})(typeof module !== 'undefined' ? module.exports : (this.Stacky = this.Stacky || {}));

