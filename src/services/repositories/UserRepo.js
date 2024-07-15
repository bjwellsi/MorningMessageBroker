const fs = require("fs").promises;
const MongoClient = require("mongodb").MongoClient;
const MongoObjectID = require("mongodb").ObjectId;

async function getConnection() {
  var url = "mongodb://localhost:27017/morning_message_broker";
  let client = await MongoClient.connect(url);
  return client.db().collection("Users");
}

async function getUserById(id) {
  let connection = await getConnection();
  oid = MongoObjectID.createFromHexString(id);
  let query = { _id: oid };
  return await connection.findOne(query);
}

async function getUserByNickname(nickname) {
  //assuming the nicknames are unique
  let connection = await getConnection();
  let query = { nickname: nickname };
  return await connection.findOne(query);
}

async function deleteUser(id) {
  let connection = await getConnection();
  oid = MongoObjectID.createFromHexString(id);
  let query = { _id: oid };
  return await connection.deleteOne(query);
}

async function createUser(user) {
  let connection = await getConnection();
  return await connection.insertOne(user);
}

module.exports = {
  getUserById,
  getUserByNickname,
  deleteUser,
  createUser,
};
