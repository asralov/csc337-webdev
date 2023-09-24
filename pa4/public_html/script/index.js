/*This is a javascript file that helps to change letters
on the website using the Caesar cipher algorithm
*/
// This is a function to update the counter every time user slides the slider
function updateCounter(value) {
  const counter = document.getElementById("counter");
  counter.textContent = value;
}

// is needed when user first opens the website, it will be there by default
window.onload = function () {
  const defaultInput = document.getElementById("userInput").value;
  content1.textContent = defaultInput;
  content2.textContent = defaultInput;
};

/*This is a function that uses the algorith to encrypt the text for the sector 2
or for the upper part of the text that is being entered, user can change that with
the slider on the sector 1
*/
function shiftText(userInput, nShifts) {
  userInput = userInput.toUpperCase();
  const outputElement = document.getElementById("content1");
  const alphabet = createAnAlphabet();
  const shiftedAlphabet = createShiftedAlphabet(nShifts);
  let result = "";
  for (let c = 0; c < userInput.length; c++) {
    if (alphabet.includes(userInput[c])) {
      let newIndex = alphabet.indexOf(userInput[c]);
      let newLetter = shiftedAlphabet[newIndex];
      result += newLetter;
    } else {
      result += userInput[c];
    }
  }
  outputElement.textContent = result;
}

/*This is a function that uses the algorith to encrypt the text for the sector 3
or for the botto, part of the text that is being entered, user can change that with
the clicking the update button on the sector 1
*/
function shiftText2(userInput, shiftedAlphabet) {
  userInput = userInput.toUpperCase();
  const alphabet = createAnAlphabet();
  let result = "";
  for (let c = 0; c < userInput.length; c++) {
    if (shiftedAlphabet.includes(userInput[c])) {
      let newIndex = alphabet.indexOf(userInput[c]);
      let newLetter = shiftedAlphabet[newIndex];
      result += newLetter;
    } else {
      result += userInput[c];
    }
  }
  return result;
}

/*This is a function that is being called when an event is happening
such as clicking or inputing. And this function is called when the 
button is being clicked
*/
function updateContent2(shiftedAlphabet) {
  const content2 = document.getElementById("content2");
  const userInput = document.getElementById("userInput");
  const contetn2Result = shiftText2(userInput.value, shiftedAlphabet);
  content2.textContent = contetn2Result;
}

//This is a function that is being called when user enters an input
const slider = document.getElementById("shiftRange");
function updateContent() {
  const user = document.getElementById("userInput").value;
  const value = slider.value;
  const shiftedText = shiftText(user, value);
  content1 = shiftedText;
}

// Add an event listener to the slider for value changes
slider.addEventListener("input", () => {
  currentShiftValue = slider.value;
  updateContent();
  updateCounter(currentShiftValue);
});

// Add an event listener to the input, when user enters some value, then it is being updated
let sector3Content = createAnAlphabet();
const userInput = document.getElementById("userInput");
userInput.addEventListener("input", () => {
  updateContent();
  updateContent2(sector3Content);
});

// Add an event listener to the update button, when user presses the button,
// then it is being updated because of the square in the sector 1
const updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", () => {
  sector3Content = randomGridAlphabet();
  updateContent2(sector3Content);
});

// To display the shifted Text to the second section
function createShiftedAlphabet(nShifts) {
  const alphabet = createAnAlphabet();
  // when the slider at 0 and 26 nothing should change
  if (nShifts == 0 || nShifts == 26) {
    return alphabet;
  }
  const newArray = [];
  for (let c = 0; c < alphabet.length; c++) {
    let newIndex = (c - nShifts) % alphabet.length;
    if (newIndex < 0) {
      newIndex += alphabet.length;
    }
    newArray[newIndex] = alphabet[c];
  }
  return newArray;
}

// To get a shifted alphabet
function randomGridAlphabet() {
  const alphabet = createAnAlphabet();
  alphabet.pop();
  alphabet.sort(() => Math.random() - 0.5);
  for (let c = 0; c < alphabet.length; c++) {
    let index = c.toString();
    document.getElementById(index).innerText = alphabet[c];
  }
  // returns an alphabet that is random with 25 letters exluding Z
  return alphabet;
}

// A little helper to generate the alphabet
function createAnAlphabet() {
  const alphabet = [];
  for (let i = 65; i <= 90; i++) {
    alphabet.push(String.fromCharCode(i));
  }
  // getting the resulting list of Upper case letters
  return alphabet;
}
