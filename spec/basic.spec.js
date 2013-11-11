var Toolkit = require('./../lib/toolkit');
var isSubsequence = require('./../lib/subsequence');
var corpus = require('./../lib/corpus');

describe('isSubsequence', function() {
  it('should be return true if a needle is a subsequence of a haystack and false otherwise', function() {
    expect(isSubsequence('needle', 'anfenendflgawe')).toBe(true);
    expect(isSubsequence('false', 'fweafalgrs')).toBe(false);
  })
})

describe('toolkit', function() {
  describe('guesser', function() {
    var guesser;

    it('should be trained using a generalized corpus, and a domain-specific corpus',
      function() {
        guesser = new Toolkit(['thing', 'man', 'thing'], ['biology', 'eukaryote', 'no']);
      }
    );

    it('should have a language model using those words', function() {
        expect(guesser.generalized['thing']).toBe(2);
        expect(guesser.generalized['man']).toBe(1);
        expect(guesser.domain['biology']).toBe(1);
        expect(guesser.domain['eukaryote']).toBe(1);
        expect(guesser.domain['no']).toBe(1);
    });

    describe('guess method', function() {
      it('should return a string', function() {
        expect(typeof(guesser.guess('no'))).toEqual('string');
      });
    });

    describe('biology based spelling correction', function() {
      it('should load a bio-based corpus and a generalized corpus', function() {
        var bioCorpus = corpus('./training/biology.txt');
        var generalCorpus = corpus('./training/big.txt');

        guesser = new Toolkit(generalCorpus, bioCorpus);
      });

      it('should be able to provide right spelling corrections most of the time', function() {
        var input = {
          test: 'test',
          the: 'the',
          man: 'man',
          sci: 'science',
          chem: 'chemistry',
          disordr: 'disorder',
          developmntl: 'developmental',
          prot: 'protein',
          crys: 'crystal',
          behav: 'behavior',
          cncptn: 'conception',
          mol: 'molecule',
          molecle: 'molecule',
          fun: 'fungi'
        }

        for (var key in input) {
          expect(guesser.guess(key)).toEqual(input[key]);
        }
      });
    });
  });
});