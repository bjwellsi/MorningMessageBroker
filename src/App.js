const fs = require("fs").promises;
const routes = require("./AppRoutes.js");
const express = require("express");

function main() {
  var apiKey = process.env.SENDGRID_API_KEY;
  console.log(apiKey);
  routes.initiateServer();
}

main();
