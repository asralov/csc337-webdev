/**
 * Author: Abrorjon Asralov
 * Class: CSC337
 * Purpose: This is a javascipt file to write functioning features of the website
 * such as getting translations and showing it to the user real-time. Other than 
 * that it can be used for styling purposes to make look the webiste more dynamic
 */


//update the value of the option


comms = {'en&sp':'e2s', 'sp&en': 's2e', 'en&ger': 'e2g', 'ger&en': 'g2e', 'sp&ger': 's2g', 'ger&sp': 'g2s'}
// get the selection of languages

function whichLanguage(){
    let translatefrom = document.getElementById('fromLanguage').value;
    let translateTo = document.getElementById('toLanguage').value;
    if (translateTo==translatefrom){
        // we need to show the same language in both sides
        return 'same'
    } 
    // the case when they are not same
    let result = translatefrom+"&"+translateTo;
    // returns the appropriate command, example: if values are sp and en, it makes it sp&en and returns the 
    // value from the object
    return comms[result]
}

function formatTheText(content){
    const contentWords = content.toLowerCase().split(' ');
    if (contentWords.length == 1){
        return contentWords[0];
    }
    let result = "";
    for (let i = 0; i < contentWords.length-1;i++){
        result += contentWords[i] + '+';
    }
    result += contentWords[contentWords.length-1];
    return result;
    
}


const userInput = document.getElementById("inPut");
const translation = document.getElementById("outPut");
const fromLanguage = document.getElementById('fromLanguage');
const toLanguage = document.getElementById('toLanguage');
function updateLanguage(){
    if (userInput.value==''){
        translation.value ='';
    }
    const text = formatTheText(userInput.value);
    const method = whichLanguage();
    // if the request is not the same as the second language,it makes ajax request
    if (method!=='same'){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/translate/${method}/${text}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                translation.value = xhr.responseText;
            }
        };
        xhr.send();
    } else { // if languages are the same, then it simply shows the same content to the right
        translation.value = userInput.value;
    }
}
userInput.addEventListener('input', updateLanguage);
fromLanguage.addEventListener('change', updateLanguage);
toLanguage.addEventListener('change', updateLanguage);

/*
userInput.addEventListener('input', function () {
    const text = formatTheText(userInput.value);
    const method = whichLanguage();
    // if the request is not the same as the second language,it makes ajax request
    if (method!=='same'){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/translate/${method}/${text}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                translation.value = xhr.responseText;
            }
        };
        xhr.send();
    } else { // if languages are the same, then it simply shows the same content to the right
        translation.value = userInput.value;
    }
});
*/