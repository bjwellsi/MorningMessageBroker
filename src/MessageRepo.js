const { Collection } = require("mongodb");

const fs = require("fs").promises;
const MongoClient = require("mongodb").MongoClient;

function mongoConnection(collection) {
  var url = "mongodb://localhost:27017/morning_message_broker";
  return MongoClient.connect(url).then((client) => {
    return client.db().collection(collection);
  });
}

function getMessageList() {
  //currently just going to return all
  //should obviously be a bit more specific in the future, w/user for ex
  return mongoConnection("messages").then((collection) => {
    return collection
      .find()
      .toArray()
      .then((array) => {
        return array;
      })
      .catch((err) => {
        throw err;
      });
  });
}

function getNextRandomMessage() {
  //should probably refactor this to call mongo directly instead of randomly grabbing the whole collection
  return getMessageList().then((messages) => {
    const len = messages.length;
    const rand_index = Math.round(Math.random() * (len - 1));
    return messages[rand_index];
  });
}

function getMessageTypes() {
  return mongoConnection("messages").then((collection) => {
    return collection.distinct("type", {}).then((array) => {
      console.log(array);
      return array;
    });
  });
}

function getMessagesByType(type) {
  //returns first message of a given type
  var query = { type: type };
  return mongoConnection("messages")
    .then((collection) => {
      return collection
        .find(query)
        .toArray()
        .then((messages) => {
          return messages;
        });
    })
    .catch((err) => {
      throw err;
    });
}

function getMessageByType(type) {
  //returns first message of a given type
  var query = { type: type };
  return mongoConnection("messages")
    .then((collection) => {
      return collection.findOne(query).then((val) => {
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

  return mongoConnection("messages")
    .then((collection) => {
      return collection.insertOne(message).then((res) => {
        return res;
      });
    })
    .catch((err) => {
      throw err;
    });
}

module.exports = {
  mongoConnection,
  insertMessage,
  getMessageByType,
  getNextRandomMessage,
  getMessageList,
  getMessagesByType,
  getMessageTypes,
};
