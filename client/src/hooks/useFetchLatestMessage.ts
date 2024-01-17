/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";
import { MessageType, userChatType } from "../types";

export const useFetchLatestMessage = (chat: userChatType | null) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState<MessageType | null>(null);

  useEffect(() => {
    const getMessage = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

      if (response.error) {
        return console.log("Error getting latest message", response.error);
      }

      const lastMessage = response[response?.length - 1];

      setLatestMessage(lastMessage);
    };

    getMessage();
  }, [newMessage, notifications]);

  return { latestMessage };
};
