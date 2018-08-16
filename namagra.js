var wordlist;
const wordlistURI = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';

document.getElementById("loadButton").onclick = loadApplication;

function changeButton() {
  document.getElementById("loadButton").value = 'Loading...';
  document.getElementById("loadButton").disabled = 'disabled';
}

function loadApplication() {
  changeButton();
  var oReq = new XMLHttpRequest();
  oReq.onload = reqListener;
  oReq.open("get", wordlistURI, true);
  oReq.send();
}

function reqListener(e) {
    var treeData = JSON.parse(this.responseText);

    showVueApp();
    startVue(treeData);
}

function showVueApp() {
  document.getElementById("app").innerHTML = '<input v-model="input"><button v-on:click="findSolutions">Solve!</button><ul><li v-for="result in results">{{ result }}</li></ul>';
}

function startVue(dictionary) {
  var app = new Vue({
    el: '#app',

    data: {
      input: 'namagra',
      results: [
      ],
      wordlist: dictionary,
      isLoaded: true,
      matchLength: false
    },

    methods: {

      findSolutions: function () {
        // Reset results
        this.results = [];

        // Remove spaces
        this.input = this.input.replace(/\s/g, '');
        // Extract characters
        var chars = [];
        for (var i = 0; i < this.input.length; i++){
          chars.push(this.input[i].toLowerCase());
        }
        var variations = getVariations(chars, this.matchLength);
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
    // Only add if not already matched
    if(matches.indexOf(word) === -1) {
      // Check if matches a word in dictionary
      if (wordlist[word]) {
        matches.push(word);
      }
    }
  }
  return matches;
}

function getVariations(charArray, matchLength) {
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

      var subVariations = getVariations(cloned, matchLength);
      //console.log(char);
      //console.log(cloned);
      for (var v = 0; v < subVariations.length; v++) {
        // Add selected character to beginning
        var str = char.concat(subVariations[v]);
        variations.push(str);
      }
      // Add the letter on its own for base case
      if(matchLength === true) {
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
