const express = require("express");
const {
  createChat,
  findAllUserChats,
  findUserChat,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findAllUserChats);
router.get("/find/:firstId/:secondId", findUserChat);

module.exports = router;
