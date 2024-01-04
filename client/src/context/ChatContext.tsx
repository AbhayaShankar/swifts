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

  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
