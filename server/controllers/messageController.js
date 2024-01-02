const MessageModel = require("../models/messageModel");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();
    res.status(201).json(response);
  } catch (error) {
    console.log("CreateMessage", error);
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await MessageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log("GetMessageError", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMessage, getMessages };
