const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const messageRoutes = require("./routes/MessageRoutes.js");
const logging = require("./services/logging.js");

async function initiateServer() {
  try {
    let serverParams = JSON.parse(
      await fs.readFile("./storage/ServerParams.json"),
    );

    const app = express();

    app.listen(serverParams.port);
    logging.log_message(
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
  } catch (err) {
    logging.log_error(err);
  }
}

module.exports = { initiateServer };
