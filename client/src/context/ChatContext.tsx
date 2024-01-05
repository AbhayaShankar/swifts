import React, { createContext, useCallback, useEffect, useState } from "react";
import {
  ChatContextType,
  UserChatsType,
  UserType,
  userChatType,
} from "../types";
import { baseUrl, getRequest, postRequest } from "../utils/services";

interface ChatContextProps {
  children: React.ReactNode;
  user: UserType | null;
}

export const ChatContext = createContext({} as ChatContextType);

const ChatContextProvider: React.FC<ChatContextProps> = ({
  children,
  user,
}) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState<userChatType | null>(null);

  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  console.log("Current Chat", currentChat);
  console.log("Messages", messages);

  // Get Users who donot have a chat with Logged in user yet.
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("ppotential Chat Error", response);
      }

      const pChats = response.filter((u: UserType) => {
        let isChatCreated = false;
        if (user?.id === u._id) return false;

        if (userChats) {
          isChatCreated = (userChats as UserChatsType)?.some(
            (chat: userChatType) => {
              return chat.members[0] === u._id || chat.members[1] === u._id;
            }
          );
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
    };

    getUsers();
  }, [user?.id, userChats]);

  // Get Chats for logged in user
  useEffect(() => {
    const getUserChats = async () => {
      if (user?.id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?.id}`);

        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user]);

  // Get Messages for a chat
  useEffect(() => {
    const getMessages = async () => {
      if (user?.id) {
        setIsMessagesLoading(true);
        setMessagesError(null);

        const response = await getRequest(
          `${baseUrl}/messages/${currentChat?._id}`
        );

        setIsMessagesLoading(false);
        if (response.error) {
          return setMessagesError(response);
        }

        setMessages(response);
      }
    };

    getMessages();
  }, [currentChat?._id, user]);

  // Create a chat between users
  const createChat = useCallback(async (firstId: string, secondId: string) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log("Error creating Chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const updateCurrentChat = useCallback((chat: userChatType) => {
    setCurrentChat(chat);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
