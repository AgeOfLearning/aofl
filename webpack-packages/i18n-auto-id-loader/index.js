const addTtTags = require('@aofl/cli/lib/tt-tags');
const fs = require('fs');

module.exports = function(content, map, meta) {
  this.cacheable(true);

  const sourcePath = this.resourcePath;
  const ttTags = addTtTags(content);

  if (ttTags !== content) {
    fs.writeFileSync(sourcePath, ttTags);
  }
  return ttTags;
};
