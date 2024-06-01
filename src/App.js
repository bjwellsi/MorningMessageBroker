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
        msg_repo
          .getNextRandomMessage()
          .then((out) => {
            return out;
          })
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

      app.use((req, res) => {
        res.status(404).send("404 err\n");
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { initiateServer };
