import React, { createContext, useEffect, useState } from "react";
import { ChatContextType, UserType } from "../types";
import { baseUrl, getRequest } from "../utils/services";

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

  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
