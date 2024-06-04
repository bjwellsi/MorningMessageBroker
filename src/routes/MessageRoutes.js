const express = require("express");
const mailer = require("../SendGridEmail.js");
const msg_repo = require("../MessageRepo.js");

const router = express.Router();

router.get("/send", (req, res) => {
  //for now the defined behavior is going to be
  //if id provided, ignore the type
  //if neither provided, default to totally random message
  const id = req.query.id;
  const type = req.query.type;
  if (id != null) {
    msg_repo
      .getMessageByID(id)
      .then((message) => {
        return mailer.sendEmail(
          message.destination,
          message.subject,
          message.data,
        );
      })
      .then(() => {
        res.status(200).send("Message sent\n");
      })
      .catch((err) => {
        res.status(400).send("Couldn't find the message\n");
        throw err;
      });
  } else {
    msg_repo
      .getNextRandomMessage(type) //this function will handle the null mapping of type for us
      .then((message) => {
        return mailer.sendEmail(
          message.destination,
          message.subject,
          message.data,
        );
      })
      .then(() => {
        res.status(200).send("Message Sent\n");
      })
      .catch((err) => {
        res.status(400).send("Failed to send\n");
        throw err;
      });
  }
});

router.get("/types", (req, res) => {
  msg_repo
    .getMessageTypes()
    .then((types) => {
      res.status(200).send({ types });
    })
    .catch((err) => {
      res.status(400).send("Unknown err");
      throw err;
    });
});

router.get("", (req, res) => {
  const type = req.query.type;
  const id = req.query.id;
  if (id != null) {
    msg_repo
      .getMessageByID(id)
      .then((message) => {
        res.status(200).send(message);
      })
      .catch((err) => {
        res.status(400).send("Couldn't find message");
        throw err;
      });
  } else if (type == null) {
    msg_repo
      .getMessageList()
      .then((messages) => {
        res.status(200).send(messages);
      })
      .catch((err) => {
        res.status(400).send("Unknown err");
        throw err;
      });
  } else {
    msg_repo
      .getMessagesByType(type)
      .then((messages) => {
        res.status(200).send(messages);
      })
      .catch((err) => {
        res.status(400).send("Unknown err");
        throw err;
      });
  }
});

router.post("", (req, res) => {
  msg_repo
    .insertMessage(req.body)
    .then((data) => {
      res.status(200).send(data + "\n");
    })
    .catch((err) => {
      res.status(400).send(err + "\n");
    });
});

router.delete("", (req, res) => {
  const id = req.query.id;
  msg_repo
    .deleteMessageByID(id)
    .then((result) => {
      res.status(200).send("Deleted\n");
    })
    .catch((err) => {
      res.status(400).send("Failed to delete\n");
      throw err;
    });
});

module.exports = router;
