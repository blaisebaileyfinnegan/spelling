var restify = require('restify');

var corpus = require('./lib/corpus');
var Toolkit = require('./lib/toolkit');

var generalized = corpus('./training_data/big.txt');
var domain = corpus('./training_data/biology.txt');

var toolkit = new Toolkit(generalized, domain);

var server = restify.createServer();

server.get('/:word', function(req, res, next) {
  var word = req.params.word.trim();

  try {
    var correction = toolkit.guess(word);
    res.send(200, correction);
  } catch (e) {
    res.send(404, null);
  }

  next();
});

server.listen(2000);
