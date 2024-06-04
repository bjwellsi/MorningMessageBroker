const fs = require("fs").promises;
const path = require("path");
const mailer = require("./SendGridEmail.js");
const express = require("express");
const msg_repo = require("./MessageRepo.js");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");

function initiateServer() {
  fs.readFile("./storage/ServerParams.json")
    .then((data) => {
      return JSON.parse(data);
    })
    .then((serverParams) => {
      console.log(serverParams);

      const app = express();

      app.listen(serverParams.port);
      console.log(
        `Server running at http://${serverParams.host}:${serverParams.port}/`,
      );

      // create a rotating write stream
      var accessLogStream = rfs.createStream("access.log", {
        interval: "1d", // rotate daily
        path: path.join(__dirname, "log"),
      });

      app.use(express.json());

      app.use(morgan("common", { stream: accessLogStream }));
      app.use(morgan("common"));

      app.get("/", (req, res) => {
        res.status(200).send("Welcome!\n");
      });

      app.get("/send", (req, res) => {
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

      app.get("/message", (req, res) => {
        let id = req.query.id;
        msg_repo
          .getMessageByID(id)
          .then((message) => {
            res.status(200).send(message);
          })
          .catch((err) => {
            res.status(400).send("Couldn't find message");
            throw err;
          });
      });

      app.get("/messages", (req, res) => {
        let type = req.query.type;
        if (type == null) {
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

      app.get("/messageTypes", (req, res) => {
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

      app.post("/message", (req, res) => {
        msg_repo
          .insertMessage(req.body)
          .then((data) => {
            res.status(200).send(data + "\n");
          })
          .catch((err) => {
            res.status(400).send(err + "\n");
          });
      });

      app.delete("/message", (req, res) => {
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

      app.use((req, res) => {
        res.status(404).send("404 err\n");
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { initiateServer };
