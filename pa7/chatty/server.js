/**
 * Author: Abrorjon Asralov
 * Class: CSC337
 * Purpose: This is a javascript file that is used for server 
 * holding purposes.
 * 
 */
const express = require('express');
const app = express();
const port = 80;
app.use(express.static('public_html'));
app.use(express.json());
const mongoose = require('mongoose');
const mongoDBURL = 'mongodb://localhost:27017';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
    console.log('Connection error')
});

// creating a schema
var chatSchema = new mongoose.Schema({
  time : Number,
  alias : String,
  message : String
});

var Chat = mongoose.model('Chat', chatSchema);

// for POST request
app.post('/chatty/post', function(req, res){
    let user = req.body.alias;
    let text = req.body.message;
    let time = req.body.time;
    let chat = new Chat({time:time, alias:user, message: text});
    chat.save().then(()=>{res.status(200).json({message: "Chat saved succesfully"});})
  .catch((error)=>{console.log("Oops there is an error:", error);
  res.status(500).json({error: "Error occured"});})
});

// the case when we need to show all messages to user
app.get('/chatty/get/allMessages', (req, res) => {
    // getting the latest messages
    const message  = Chat.find({}).exec().sort({ "message.time": 1 });
    let messages = "";
    message.then((document)=>{
      for (let text of document){
        // checking whether they are not undefined
        if (text.alias&&text.message){
          messages+= `<div class="messageBoxes">${text.alias}: ${text.message}</div>\n`;
        }
      }
      res.end(messages);
    }).catch((error)=>{
    console.error(error);
    res.status(500).send("Oops, having problems while getting the messages!");
  });
});

// clearing the history in db
app.post('/chatty/delete', async function (req, res) {
  try {
      const del = await Chat.deleteMany({});
      res.status(200).send("The history is cleaned");
  } catch (err) {
      console.error(err);
      res.status(500).send("Oops, having problems with cleaning the history :(");
  }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })