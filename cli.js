var corpus = require('./lib/corpus');
var Toolkit = require('./lib/toolkit');

if (process.argv.length != 4) {
  throw new Error('Expected to be called with <generalized> <domain>, where each argument is a path!');
}

var generalized = corpus(process.argv[2]);
var domain = corpus(process.argv[3]);

Toolkit = new Toolkit(generalized, domain);

var readline = require('readline').createInterface(process.stdin, process.stdout);

readline.setPrompt('> ');
readline.prompt();

readline.on('line', function(line) {
  var word = line.trim();
  try {
    console.log(Toolkit.guess(word));
  } catch (e) {
    console.log('No correction found for ' + word);
  }
  readline.prompt();
});
