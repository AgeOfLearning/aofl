const path = require('path');

module.exports.getChunksMap = (compilation) => {
  const chunks = compilation.chunks;
  const mappedChunks = chunks
    .reduce((acc, c) => {
      acc[c.name] = c.files
        .filter((f) => path.extname(f) !== '.map');

      return acc;
    }, {});

  return mappedChunks;
};
