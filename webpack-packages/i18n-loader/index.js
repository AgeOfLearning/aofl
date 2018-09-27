
const fs = require('fs');
const glob = require('glob');
const md5 = require('tiny-js-md5');

module.exports = function(content, map, meta) {
  const msgBlockRegex = /msgid "([^"]+)"\nmsgstr "([^"]+)?"/g;
  const jsons = {};
  let result;
  let poContent;
  let poFilename;
  let langkey;
  let hash;
  let output;
  let dirname = this.resourcePath.substr(0, this.resourcePath.lastIndexOf('/'));
  let files = glob.sync(dirname + '/*.po');

  for (let i = 0; i < files.length; i++) {
    poContent = fs.readFileSync(files[i]).toString();
    poFilename = files[i].substr(files[i].lastIndexOf('/') + 1);
    langkey = files[i].replace(poFilename, '');
    jsons[langkey] = jsons[langkey] ? jsons[langkey] : {};

    while (result = msgBlockRegex.exec(poContent)) {
      let [id, str] = result.slice().splice(1, 2);
      hash = md5(id);
      jsons[langkey][hash] = Object.assign({}, jsons[langkey][hash], {
        [poFilename.replace('.po', '')]: str
      });
    }
  }

  output = 'export default ';
  for (json in jsons) {
    if (!jsons.hasOwnProperty(json)) continue;
    output += JSON.stringify(jsons[json]);
    output += ';';
  }
  return output;
};
