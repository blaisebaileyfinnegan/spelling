spelling
========

Context-based spelling corrector, where the input word only has deleted characters.

Important: This assumes that the incorrectly spelled words are simply spliced!
This was written in an attempt to correct words in UCI's course titles on
the schedule of classes where course titles appear to have a maximum character
limit of 20. For example, conception is shortened to cncptn, molecule is
shortened to mol, etc. Letters will never be inserted, changed, or transposed--
only deleted.

The concept is similar to http://norvig.com/spell-correct.html, but there
are differences.

There is the concept of a context-based dictionary and a generalized dictionary.
Both work the same way: I build a language model of correcitons based on a generalized corpus 
and a specialized corpus. The key is the word, and the value will be the frequency that 
the word appears in its corresponding text.

Norvig's method bruteforces all possible variations of a word within edit distance of
two. Then, it will filter out the variations which don't exist inside the dictionary.

Taking advantage of the fact that input words are spliced from the "correct" spelling of the word,
My program will only enumerate possible corrections which are a supersequence of the
input. Each will then be ranked according to a couple factors: insertion distance,
frequency, whether the word is in the specialized or generalized dictionary, if the
supersequence starts with the input, etc.


## Instructions

1. Install node.js
2. Run:

```
node cli
```

### Try it out:

```
> bio
biome
> bio
biome
> biol
biology
> bio
biome
> bio
biome
> chem
chemical
```
