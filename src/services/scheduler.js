const logging = require("./logging.js");

function runSchedule() {
  logging.log_message("started");
}

module.exports = { runSchedule };
