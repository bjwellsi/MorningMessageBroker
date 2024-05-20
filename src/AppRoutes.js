const fs = require("fs").promises;
const mailer = require("./SendGridEmail.js");
const express = require("express");
const msg_repo = require("./MessageRepo.js");

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

      app.use(express.json());

      app.get("/", (req, res) => {
        console.log("request made");
        res.send("Welcome\n");
      });

      app.get("/send", (req, res) => {
        msg_repo
          .getNextRandomMessage()
          .then((message) => {
            return mailer.sendEmail(
              message.destination,
              message.subject,
              message.data,
            );
          })
          .then(() => {
            res.send("Message Sent\n");
          })
          .catch((err) => {
            res.send("Failed to send\n");
            console.log(err);
          });
      });

      app.post("/message", (req, res) => {
        console.log(req);
        msg_repo
          .insertMessage(req.body)
          .then((data) => {
            res.send(data + "\n");
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
