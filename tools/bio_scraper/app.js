var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');

var GLOSSARY_URL = 'http://www2.estrellamountain.edu/faculty/farabee/biobk/';
var GLOSSARY_INDEX = 'BioBookgloss.html';

if (process.argv.length != 3) {
  throw new Error('Expected 1 argument <outputFile>');
}

var output = process.argv[2];

request(GLOSSARY_URL + GLOSSARY_INDEX, function(error, response, body) {
  if (response.statusCode != 200) {
    throw new Error();
  }

  var links = parseGlossaryMain(body);
  async.mapLimit(links, 4, requestPage, function(err, bodies) {
    if (err) throw err;

    var bodies = bodies.map(function(body) {
      var paragraphs = parseGlossaryPage(body);
      return paragraphs.join(' ');
    });

    var corpus = bodies.join(' ');
    fs.writeFileSync(output, corpus);
  })
});

function requestPage(url, next) {
  request(GLOSSARY_URL + url, function(error, response, body) {
    if (error) throw error;

    if (response.statusCode != 200) {
      throw new Error();
    }

    next(null, body);
  });
}

/**
 * @return array of string URLs to invidivual glossary pages
 */
function parseGlossaryMain(body) {
  $ = cheerio.load(body);
  var lettersContainer = $('h3');
  if (lettersContainer.length != 1) {
    throw new Error('Expected 1 letter container! Got: ' + lettersContainer.length);
  }

  var hrefs = lettersContainer.children();
  var links = hrefs.map(function () {
    return $(this).attr('href');
  });

  return links;
}

function parseGlossaryPage(body) {
  $ = cheerio.load(body);
  var paragraphs = $('p');

  if (paragraphs.length < 1) {
    throw new Error('Expected at least 1 paragraph of words!');
  }

  paragraphs = paragraphs.map(function() {
    return $(this).text();
  });

  return paragraphs;
}
