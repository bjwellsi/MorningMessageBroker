const fs = require("fs").promises;
const mailer = require("./SendGridEmail.js");
const express = require("express");

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
        getNextMessage()
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
        insertMessage(req.body)
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

function getNextMessage() {
  return fs
    .readFile("./storage/NextMessage.json")
    .then((data) => {
      return JSON.parse(data);
    })
    .then((message) => {
      return message;
    })
    .catch((err) => {
      console.log(err);
    });
}

function insertMessage(message) {
  //basically validate the json
  //obviously not a pretty way to do it
  console.log(message);
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

module.exports = { initiateServer };
