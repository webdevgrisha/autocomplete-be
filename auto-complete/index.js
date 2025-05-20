// Complexity: O(n * m), where n - number of words, m - max length of word
// Memory complexity: O(n * m^2) in the worst case, which can grow up to O(n^3)
// if m is proportional to n.
function createAutoComplete(wordsArr) {
  const autocompleteObj = {};

  wordsArr.forEach((word) => {
    const lowerCaseWord = word.toLowerCase();
    let subword = "";

    for (let letter of lowerCaseWord) {
      subword += letter;

      if (!(subword in autocompleteObj)) {
        autocompleteObj[subword] = [word];
      } else {
        autocompleteObj[subword].push(word);
      }
    }
  });

  // Complexity: O(1), as object property lookup is constant time.
  // Memory complexity: O(n), where n - length of wordsIndexArr
  const autoComplete = function (letters) {
    if (typeof letters !== "string") return [];

    const lowerCaseLetters = letters.toLowerCase();

    const wordsArr = autocompleteObj[lowerCaseLetters] || [];

    return wordsArr;
  };

  return autoComplete;
}

export { createAutoComplete };
