/**
 * Author: Abrorjon Asralov
 * Class: CSC337
 * Purpose: This is a js file to work with client side
 * that interracts with the server side. It works with
 * elements and makes a web application to be an event-driven
 * web
 */
// when the whole page is being loaded
document.addEventListener('DOMContentLoaded', ()=>{
    getMessages();
    const sendBtn = document.getElementById("sendBtn");

    // adding an event listener "CLICK" when the send button is being clicked
    sendBtn.addEventListener('click', ()=>{
        // getting values of the sender and text values
        let alias = document.getElementById("sender").value;
        let text = document.getElementById("message").value;

        // after all we can update the message box to be empty again
        document.getElementById('sender').value = "";
        document.getElementById('message').value = "";

        // creating a post request
        const xmr = new XMLHttpRequest();
        xmr.open("POST", "chatty/post", true);
        xmr.setRequestHeader('Content-type', 'application/json');

        // getting it when it is loading
        xmr.onload = ()=>{
            // checking whether our request was succesfull
            if (xmr.status >= 200 && xmr.status < 400){
                console.log("A succesfull request");
            } // else case when it is not succesfull request
            else {
                console.log("ERROR: " + xmr.status);
            }
            xmr.send(JSON.stringify({alias: alias, message: text}));
        }
    });

    // getting shown all messages 
    async function getMessages(){
        const res = fetch('chatty/get/allMessages');
        res.then((result) => {
            const content = (result).text();
            const chatBox = document.getElementById("content");
            chatBox.innerHTML = content;
        }).catch((error)=> {
            console.log(error);
        })        
    }

    // clearing messages when user wants to clear messages and data
    const clearBtn = document.getElementById("clearHistory");
    clearBtn.addEventListener('click', () => {
        fetch('chatty/delete', {method: "POST"});
    });

    // updating every minute;
    setInterval(getMessages, 1000);

});