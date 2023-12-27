// Chat Controllers

// 1. createChat -- /chats
// 2. findAllUserChats -- /:userId (Finding all chats for that userId)
// 3. findChat -- /find/:userId_1/:userId_2 (Finding Conversation between two users. )

const chatModel = require("../models/chatModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    return res.status(201).json(response);
  } catch (error) {
    console.log("CreateChatError", error);
    res.status(500).json({ message: error.message });
  }
};

const findAllUserChats = async (req, res) => {};

const findUserChat = async (req, res) => {};

module.exports = { createChat, findAllUserChats, findUserChat };
