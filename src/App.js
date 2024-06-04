const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const messageRoutes = require("./routes/MessageRoutes.js");

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

      app.use("/messages", messageRoutes);

      app.use((req, res) => {
        res.status(404).send("404 err\n");
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { initiateServer };
