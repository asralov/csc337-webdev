/**
 * Author: Abrorjon Asralov
 * Class: CSC337
 * Purpose: This is a javascript file that is used for server 
 * holding purposes.
 * 
 */

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.static('public_html'));



// getting dictionaries for 4 possible language combinations and 2 commands for the future function
const english2German = new Map();
const english2Spanish = new Map();
const german2English = new Map();
const spanish2English = new Map();
const german2Spanish = "g2s";
const spanish2German = "s2g";

// gettting main commands to choose from what language to what language
// we are getting dictionaries
const commands = {
  e2s: english2Spanish,
  e2g: english2German,
  g2e: german2English,
  s2e: spanish2English,
  g2s: german2Spanish,
  s2g: spanish2German,
};


 //Starting working on translations
 /**
  * This is a function that creates all needed dictionaries that user asks
  * It gets no parameters, and returns void, instead it changes the maps
  */
function createSpanish(spanish){
  for (const line of spanish) {
    if (!line.startsWith("#")) {
      const [engWord, spanWord] = line.split("\t");
      if (engWord && spanWord) {
        const newEngWord = formatWord(engWord);
        const newSpanWord = formatWord(spanWord);
        if (isNotDuplicate(newEngWord, english2Spanish)) {
          english2Spanish[newEngWord] =  newSpanWord;
        }
        if (isNotDuplicate(newSpanWord, spanish2English)) {
          spanish2English[newSpanWord] = newEngWord;
        }
      }
    }
  }
}

function createGerman(german){
  for (const line of german) {
    if (!line.startsWith("#")) {
      const [engWord, gerWord] = line.split("\t");
      if (engWord && gerWord) {
        const newEngWord = formatWord(engWord);
        const newGerWord = formatWord(gerWord);
        if (isNotDuplicate(newEngWord, english2German)) {
          english2German[newEngWord] =  newGerWord;
        }
        if (isNotDuplicate(newGerWord, german2English)) {
          german2English[newGerWord] = newEngWord;
        }
      }
    }
  }
}

/**
 * This is a function that checks whether our chosen map contains the asked
 * element in it, if so returns true, otherwise, false
 * @param {*} key this is a key that is a word that is being translated from
 * @param {*} dict this is a map with the language of that word
 * @returns a boolean that shows whether it contains that word
 */
function isNotDuplicate(key, dict) {
  return !dict.has(key);
}

/**
 * This is a function that formats the word that has extra non-alpha chars
 * @param {*} word is a string with all chars innit
 * @returns a string with the correct format
 */
function formatWord(word) {
  let result = "";
  let i = 0;
  let isAlpha = true;
  while (i < word.length && isAlpha) {
    if (word[i] == ' ' || word[i] == '�') {result+=word[i]}
    else if (!word[i].match(/^[a-zA-Z]$/)) {
      isAlpha = false;
    } else {
      result += word[i].toLowerCase();
    }
    i++;
  }
  return result
}
/**
 * This is a function that is to translate the user's content that is being asked
 * @param {*} dict is a map with the certain language translations
 * @param {*} content is a string separeted with the "+" sign instead of white spaces
 * @returns a string that is translated from the dict of that language
 */
function translateTo(dict, content) {
  // when we are trying to get the index of "+"
  // we need to get a -1 which means it is not
  // found, so we can returns one word as we assume
  // the content with several words are connected with "+"
  if (content.indexOf("+") == -1) {
    return translateWordHelper(dict, content);
  } else {
    // an array with all words
    let result = "";
    let newContent = content.split("+");
    for (let word of newContent) {
      word = translateWordHelper(dict, word);
      if (word) {
        result+= word + ' ';
      } else {
        result += "? "
      }
    }
    return result;
  }
}
// will be used when it is a spanish to german or german to spanish
function translateWordHelper(dict, word){
  if (dict=='s2g'){
    let eng = spanish2English[word];
    let get = english2German[eng];
    return get;
  }
  if (dict == 'g2s'){
    let eng = german2English[word];
    let sp = english2Spanish[eng];
    return sp;
  } else {
    return dict[word]
  }
}


app.get('/translate/:commands/:contents', (req, res) => {
  const command = req.params.commands;
  const content = req.params.contents;
  // Read the Spanish file
  fs.readFile("Spanish.txt", "utf-8", function(err, spanishData) {
    if (err) {
      console.log("Spanish File is not found");
    } else {
      // Create the Spanish to German and Spanish to English dictionaries
      createSpanish(spanishData.split('\n'));
      // Read the German file
      fs.readFile("German.txt", 'utf-8', function(err, germanData) {
        if (err) {
          console.log("German File is not Found");
        } else {
          // Create the German to English dictionary
          createGerman(germanData.split('\n'));
          // Populate Spanish to German and German to Spanish dictionaries
          

          // Translate the content and send the response
          const dict = commands[command];
          const translatedContent = translateTo(dict, content);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(translatedContent);
        }
      });
    }
  });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })