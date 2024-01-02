// Chat Controller

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

const findAllUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.log("findAllUserChatsError", error);
    res.status(500).json({ message: error.message });
  }
};

const findUserChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log("findUserChatError", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createChat, findAllUserChats, findUserChat };
