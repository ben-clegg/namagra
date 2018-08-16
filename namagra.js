var wordlist;
const wordlistURI = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open("get", wordlistURI, true);
oReq.send();

function reqListener(e) {
    var treeData = JSON.parse(this.responseText);
    console.log(treeData);

    startVue(treeData);
}

function startVue(dictionary) {
  var app = new Vue({
    el: '#app',

    data: {
      input: 'namagra',
      results: [
      ],
      wordlist: dictionary,
      isLoaded: true
    },

    methods: {

      findSolutions: function () {
        // Reset results
        this.results = [];

        // Extract characters
        var chars = [];
        for (var i = 0; i < this.input.length; i++){
          chars.push(this.input[i].toLowerCase());
        }
        var variations = getVariations(chars, true);
        var matching = getExisting(variations, this.wordlist);
        this.results = matching;
      }
    }
  });
}


function getExisting(toCheck, wordlist) {
  console.log(wordlist);
  var matches = [];
  for (var i = 0; i < toCheck.length; i++) {
    var word = toCheck[i];
    if (wordlist[word]) {
      matches.push(word);
    }
  }
  return matches;
}

function getVariations(charArray, anagramOnly) {
  // If no characters remain, return an empty array (of strings)
  if(charArray.length === 0) {
    return [];
  }

  var variations = [];
  // Extract each character to form a new first character
  for (var i = 0; i < charArray.length; i++) {
      var cloned = [].concat(charArray);

      // Get character
      var char = cloned[i];
      // Remove the character from the pool
      cloned.splice(i, 1);

      var subVariations = getVariations(cloned, anagramOnly);
      //console.log(char);
      //console.log(cloned);
      for (var v = 0; v < subVariations.length; v++) {
        // Add selected character to beginning
        var str = char.concat(subVariations[v]);
        variations.push(str);
      }
      // Add the letter on its own for base case
      if(anagramOnly === true) {
        // Only finding direct anagrams (no sub-strings)
        if (subVariations.length === 0) {
          // Only do this if there are no sub-options
          variations.push(char);
        }
      }
      else {
        // Allow finding sub-strings
        variations.push(char);
      }
  }

  // Return array of string variations
  return variations;
}
