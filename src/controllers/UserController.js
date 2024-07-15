const user_repo = require("../services/repositories/UserRepo.js");

async function getUser(req, res) {
  try {
    let user;
    if (req.id != null) {
      user = user_repo.getUserById(id);
    } else if (req.nickname != null) {
      user = user_repo.getUserByNickname(nickname);
    }

    if (user != null) res.status(200).send();
    else throw new Error("User not found\n");
  } catch (err) {
    res.status(400).send(err);
  }
}

async function createUser(req, res) {
  try {
    let user = req.user;
    //basically validate the json
    //obviously not a pretty way to do it
    //need to do more to verify, like check that you're not also getting info you don't want
    if (typeof user.nickname != string || user.nickname === "")
      throw new Error("User has no nickname\n");
    if (typeof user.email_address != string || user.email_address === "")
      //should also enforce some formatting
      throw new Error("User has no email\n");
    user_repo.createUser(user);
    res.status(200).send(user.nickname + "\n");
  } catch (err) {
    res.status(400).send(err);
  }
}

async function deleteUser(req, res) {
  try {
    if (req.id == null) throw new Error("Must delete by id");
    user_repo.deleteUser(req.id);
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports = {
  getUser,
  createUser,
  deleteUser,
};
