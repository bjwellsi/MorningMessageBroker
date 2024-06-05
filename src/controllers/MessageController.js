const mailer = require("../services/SendGridEmail.js");
const msg_repo = require("../services/MessageRepo.js");
const logging = require("../services/logging.js");

async function sendMessage(req, res) {
  //for now the defined behavior is going to be
  //if id provided, ignore the type
  //if neither provided, default to totally random message
  const id = req.query.id;
  const type = req.query.type;
  if (id != null) {
    try {
      let message = await msg_repo.getMessageByID(id);
      await mailer.sendEmail(
        message.destination,
        message.subject,
        message.data,
      );
      res.status(200).send("Message sent\n");
    } catch (err) {
      res.status(400).send("Couldn't find the message\n");
      logging.log_error(err);
    }
  } else {
    try {
      let message = await msg_repo.getNextRandomMessage(type); //this function will handle the null mapping of type for us
      await mailer.sendEmail(
        message.destination,
        message.subject,
        message.data,
      );
      res.status(200).send("Message Sent\n");
    } catch (err) {
      res.status(400).send("Failed to send\n");
      logging.log_error(err);
    }
  }
}

async function getTypes(req, res) {
  try {
    let types = await msg_repo.getMessageTypes();
    res.status(200).send({ types });
  } catch (err) {
    res.status(400).send("Unknown err");
    logging.log_error(err);
  }
}

async function getRandomMessage(req, res) {
  const type = req.query.type;
  try {
    //this function currently handles empty types for us
    let message = await msg_repo.getNextRandomMessage(type);
    res.status(200).send(message);
  } catch (err) {
    res.status(400).send("Couldn't find message");
    logging.log_error(err);
  }
}

async function getMessages(req, res) {
  const type = req.query.type;
  const id = req.query.id;
  if (id != null) {
    try {
      let message = await msg_repo.getMessageByID(id);
      res.status(200).send(message);
    } catch (err) {
      res.status(400).send("Couldn't find message");
      logging.log_error(err);
    }
  } else if (type == null) {
    try {
      let message = await msg_repo.getMessageList();
      res.status(200).send(message);
    } catch (err) {
      res.status(400).send("Couldn't find messages");
      logging.log_error(err);
    }
  } else {
    try {
      let message = await msg_repo.getMessagesByType(type);
      res.status(200).send(message);
    } catch (err) {
      res.status(400).send("Couldn't find messages");
      logging.log_error(err);
    }
  }
}

async function insertMessage(req, res) {
  try {
    let messageData = await msg_repo.insertMessage(req.body);
    res.status(200).send(messageData + "\n");
  } catch (err) {
    res.status(400).send(err + "\n");
  }
}

async function deleteMessage(req, res) {
  const id = req.query.id;
  try {
    await msg_repo.deleteMessageByID(id);
    res.status(200).send("Deleted\n");
  } catch (err) {
    res.status(400).send("Failed to delete\n");
    logging.log_error(err);
  }
}

module.exports = {
  sendMessage,
  getTypes,
  getRandomMessage,
  getMessages,
  insertMessage,
  deleteMessage,
};
