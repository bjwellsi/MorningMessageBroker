const express = require("express");
const msg_controller = require("../controllers/MessageController.js");

const router = express.Router();

router.get("/send", msg_controller.sendMessage);

router.get("/types", msg_controller.getTypes);

router.get("/random", msg_controller.getRandomMessage);

router.get("", msg_controller.getMessages);

router.post("", msg_controller.insertMessage);

router.delete("", msg_controller.deleteMessage);

module.exports = router;
