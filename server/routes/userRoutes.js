const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);

module.exports = router;
