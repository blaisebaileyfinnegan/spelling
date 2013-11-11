module.exports = isSubsequence = function(needle, haystack) {
  needle = needle.split('');
  haystack = haystack.split('');

  var haystackIndex = 0;
  while((needle.length != 0) && (needle.length <= (haystack.length - haystackIndex))) {
    if (needle[0] == haystack[haystackIndex++]) {
      needle.shift();
    }
  }

  if (needle.length == 0) {
    return true;
  } else {
    return false;
  }
}