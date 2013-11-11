var fs = require('fs');

module.exports = loadCorpus = function(file) {
  var buffer = fs.readFileSync(file);

  buffer = buffer.toString().toLowerCase();
  buffer = buffer.replace(/\\r\\n/gi, ' ');

  var wordRegex = /[a-z]+/gi;
  var info = buffer.match(wordRegex);

  return info;
}