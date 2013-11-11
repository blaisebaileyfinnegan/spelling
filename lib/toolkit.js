var isSubsequence = require('./subsequence');

/**
 * @param array generalized Words ['cat', 'burger', 'monitor', 'How']
 * @param array domain       Words ['molecule', 'biology', 'chromosome']
 */
var Toolkit = function (generalized, domain) {
  // Hash maps
  this.generalized = Object.create(null);
  this.domain = Object.create(null);

  var populate = function(map, bagOfWords) {
    bagOfWords.forEach(function(word) {
      if (!(word in map)) {
        map[word] = 1;
      } else {
        map[word]++;
      }
    });
  }

  populate(this.generalized, generalized);
  populate(this.domain, domain);

}

/**
 * Builds corrections for a word, and returns the best possible correction
 * based on the amount of points.
 * @param   string word
 * @return  string Best possible correction
 */
Toolkit.prototype.guess = function(word) {
  var corrections = this.corrections(word);

  // Return the correction with the most points.
  var maxCorrection = null;
  var max = -1;
  for (var correction in corrections) {
    if (corrections[correction] > max) {
      maxCorrection = correction;
      max = corrections[correction];
    }
  }

  if (maxCorrection == null) {
    throw new Error('No such correction for word: ' + word);
  }

  return maxCorrection;
}

/**
 * Returns an object where the keys are the possible corrections,
 * and the value of each key is the amount of points associated
 * @param   string word
 * @return  object Hash table
 */
Toolkit.prototype.corrections = function(word) {
  // We only consider insertions in our case, since words are spliced.
  // Therefore, each incorrectly spelled word must be a subsequence of an
  // existing word (or a correctly spelled word itself)

  // Build sets of words
  var generalizedCorrections = Object.keys(this.generalized);
  var domainCorrections = Object.keys(this.domain);

  var iterator = function(element) {
    return isSubsequence(word, element);
  }

  // Filter words so we're left with the ones with the incorrect word as a subsequence
  generalizedCorrections = generalizedCorrections.filter(iterator);
  domainCorrections = domainCorrections.filter(iterator);

  // We have proposed corrections available.
  // Now we figure out our error model.

  // Okay, now merge the two together.
  var corrections = Object.create(null);
  domainCorrections.forEach(function(correction) {
    // Domain proposals are worth more
    corrections[correction] = this.domain[correction]*100;
  }.bind(this));

  generalizedCorrections.forEach(function(correction) {
    if (correction in corrections) {
      corrections[correction] += this.generalized[correction];
    } else {
      corrections[correction] = this.generalized[correction];
    }
  }.bind(this));

  // If the whole word is already in our domain corrections list, give it a lot of points
  if (domainCorrections[word]) {
    corrections[word] *= 1000;
  }

  for (var correction in corrections) {
    // Favor words with a shorter insertion distance (this is not equivalent to
    // levenshtein distance)
    var distance = (correction.length - word.length) + 1;
    corrections[correction] /= distance;

    // If any of the corrections start with input, give it points
    if (correction.substring(0, word.length) == word) {
      corrections[correction] *= 30;
    }
  }

  return corrections;
}

module.exports = Toolkit;