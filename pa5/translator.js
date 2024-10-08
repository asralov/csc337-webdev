/**
 * Author: Abrorjon Asralov
 * Class: CSC337
 * Purpose: A simple javascript file that creates
 * a small server, and while getting commands as
 * URL, it processes and gives the user a translatonß
 * of the asked word
 */
// server settings
const http = require("http");
const fs = require("fs");
const hostname = "127.0.0.1";
const port = 5000;

// getting dictionaries for 6 possible language combinations
const english2German = new Map();
const english2Spanish = new Map();
const german2English = new Map();
const spanish2English = new Map();
const german2Spanish = new Map();
const spanish2German = new Map();

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
function createDicts() {
  const spanishFile = fs.readFileSync("Spanish.txt", "utf-8", function(err, data){if(err){console.log("File Error")}});
  const germanFile = fs.readFileSync("German.txt", "utf-8", function(err, data){if(err){console.log("File Error")}});
  const spanish = spanishFile.split("\n");
  // for english => spanish and spanish => english maps
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
  // for english => german and german => english maps
  const german = germanFile.split('\n');
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
  // for german => spanish and spanish => german maps
  for (let [english, spanish] in english2Spanish) {
    let german = english2German[english];
    if (german){
      spanish2German[spanish] = german;
    }
    if (spanish) {
      german2Spanish[german] = spanish;
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
    return dict[content];
  } else {
    // an array with all words
    let result = "";
    let newContent = content.split("+");
    for (let word of newContent) {
      if (word && dict[word]) {
        result+=dict[word] + ' ';
      } else {
        result += "? "
      }
    }
    return result;
  }
}

const server = http.createServer((req, res) => {
  // creates the maps 
  createDicts();
  res.statusCode = 200;
  userURL = req.url.split("/");
  // since we assume that it should be in a form of http://127.0.0.1:5000/translate/TYPE/CONTENT
  // so 3rd element gives us the command and 4th is a content
  const userCommand = userURL[1];
  const userWantsToTranslate = userURL[2];
  // gets the dictionary what user wants to use
  const userWantedLanguage = commands[userWantsToTranslate];
  const userContent = userURL[3];
  
  res.setHeader("Content-Type", "text/plain");
  if (!userCommand || !userWantsToTranslate|| !userContent) {
    res.end('Enter The Content');
  } 
  else {
    const translation = translateTo(userWantedLanguage, userContent);
    res.end(`${translation}`);
  }
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
