const fs = require("fs").promises;
const MongoClient = require("mongodb").MongoClient;

function getMessageList() {
  //currently just going to return all
  //should obviously be a bit more specific in the future, w/user for ex
  var url = "mongodb://localhost:27017/morning_message_broker";

  return MongoClient.connect(url)
    .then((client) => {
      return client.db();
    })
    .then((db) => {
      return db
        .collection("messages")
        .find()
        .toArray()
        .then((array) => {
          return array;
        });
    })
    .catch((err) => {
      throw err;
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
  var url = "mongodb://localhost:27017/morning_message_broker";

  var query = { type: type };
  return MongoClient.connect(url)
    .then((client) => {
      return client.db();
    })
    .then((db) => {
      return db
        .collection("messages")
        .findOne(query)
        .then((val) => {
          return val;
        });
    })
    .catch((err) => {
      throw err;
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

  var url = "mongodb://localhost:27017/morning_message_broker";

  return MongoClient.connect(url)
    .then((client) => {
      return client.db();
    })
    .then((db) => {
      return db
        .collection("messages")
        .insertOne(message)
        .then((res) => {
          return res;
        });
    })
    .catch((err) => {
      throw err;
    });
}

module.exports = { insertMessage, getMessageByType, getNextRandomMessage };
