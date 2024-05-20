const fs = require("fs").promises;
function getMessageList() {
  //get all possible next messages. Necessary as long as we don't have a clean db solution
  return fs
    .readFile("./storage/NextMessages.json")
    .then((data) => {
      return JSON.parse(data);
    })
    .then((messages) => {
      return messages.messages;
    })
    .catch((err) => {
      console.log(err);
    });
}

function getNextRandomMessage() {
  return getMessageList().then((messages) => {
    const len = messages.length;
    const rand_index = Math.round(Math.random() * (len - 1));
    return messages[rand_index];
  });
}

function getMessageByType(type) {
  //returns first message of a given type
  return getMessageList().then((messages) => {
    messages.forEach((message) => {
      if (message.type == type) {
        return message;
      }
    });
    return null;
  });
}

function insertMessage(message) {
  //basically validate the json
  //obviously not a pretty way to do it
  if (typeof message.destination != "string" || message.destination === "")
    throw new Error("Invalid Destination");

  if (typeof message.subject != "string" || message.subject === "")
    throw new Error("Invalid Subject");

  if (typeof message.data != "string" || message.data === "")
    throw new Error("Invalid Data");

  //assuming no errors, update the message
  return fs
    .writeFile("./storage/NextMessage.json", JSON.stringify(message))
    .then(() => {
      return "Wrote new message";
    })
    .catch((err) => {
      throw err;
    });
}

module.exports = { insertMessage, getMessageByType, getNextRandomMessage };
