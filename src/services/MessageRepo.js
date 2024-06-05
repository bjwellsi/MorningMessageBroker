const fs = require("fs").promises;
const MongoClient = require("mongodb").MongoClient;
const MongoObjectID = require("mongodb").ObjectId;

async function mongoConnection(collection) {
  var url = "mongodb://localhost:27017/morning_message_broker";
  let client = await MongoClient.connect(url);
  return client.db().collection(collection);
}

async function getMessageList() {
  //currently just going to return all
  //should obviously be a bit more specific in the future, w/user for ex
  const collection = await mongoConnection("messages");
  return await collection.find().toArray();
}

async function getNextRandomMessage(type) {
  //should probably refactor this to call mongo directly instead of randomly grabbing the whole collection
  if (type != null) {
    return await getMessagesByType(type).then((messages) => {
      const len = messages.length;
      const rand_index = Math.round(Math.random() * (len - 1));
      return messages[rand_index];
    });
  } else {
    return await getMessageList().then((messages) => {
      const len = messages.length;
      const rand_index = Math.round(Math.random() * (len - 1));
      return messages[rand_index];
    });
  }
}

async function getMessageTypes() {
  const collection = await mongoConnection("messages");
  return await collection.distinct("type", {});
}

async function getMessagesByType(type) {
  //returns first message of a given type
  const collection = await mongoConnection("messages");
  var query = { type: type };
  return await collection.find(query).toArray();
}

async function getMessageByType(type) {
  //returns first message of a given type
  const collection = await mongoConnection("messages");
  var query = { type: type };
  return await collection.findOne(query);
}

async function getMessageByID(id) {
  const collection = await mongoConnection("messages");
  oid = MongoObjectID.createFromHexString(id);
  var query = { _id: oid };
  return await collection.findOne(query);
}

async function insertMessage(message) {
  //basically validate the json
  //obviously not a pretty way to do it
  const collection = mongoConnection("messages");
  if (typeof message.destination != "string" || message.destination === "")
    throw new Error("Invalid Destination");

  if (typeof message.subject != "string" || message.subject === "")
    throw new Error("Invalid Subject");

  if (typeof message.data != "string" || message.data === "")
    throw new Error("Invalid Data");

  return await collection.insertOne(message);
}

async function deleteMessageByID(id) {
  const collection = await mongoConnection("messages");
  const oid = MongoObjectID.createFromHexString(id);
  const query = { _id: oid };
  return await collection.deleteOne(query);
}

module.exports = {
  mongoConnection,
  insertMessage,
  getMessageByType,
  getNextRandomMessage,
  getMessageList,
  getMessagesByType,
  getMessageTypes,
  getMessageByID,
  deleteMessageByID,
};
