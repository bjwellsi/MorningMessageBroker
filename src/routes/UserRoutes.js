const express = require("express");
const user_controller = require("../controllers/UserController.js");

const router = express.Router();

router.get("", user_controller.getUser);

router.delete("", user_controller.deleteUser);

router.post("", user_controller.createUser);

module.exports = router;
