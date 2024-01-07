import React, { createContext, useCallback, useEffect, useState } from "react";
import {
  ChatContextType,
  ErrorType,
  MessagesType,
  UserChatsType,
  UserType,
  userChatType,
} from "../types";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

interface ChatContextProps {
  children: React.ReactNode;
  user: UserType | null;
}

export const ChatContext = createContext({} as ChatContextType);

const ChatContextProvider: React.FC<ChatContextProps> = ({
  children,
  user,
}) => {
  const [userChats, setUserChats] = useState<UserChatsType | null>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
  const [userChatsError, setUserChatsError] = useState<ErrorType | null>(null);
  const [potentialChats, setPotentialChats] = useState<UserType[]>([]);
  const [currentChat, setCurrentChat] = useState<userChatType | null>(null);

  const [messages, setMessages] = useState<MessagesType | null>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<ErrorType | null>(null);
  const [sendTextMessageError, setSendTextMessageError] =
    useState<ErrorType | null>(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log("online Users", onlineUsers);

  // Initializing Socket

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Cleanup for socket incase we try to create connection again, we remove the existing connection...
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fire the addNewUser Event which we created in socket
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?.id);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

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

  // create/send a message
  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: string | undefined,
      currentChatId: string | undefined,
      setTextMessage: React.Dispatch<React.SetStateAction<string>>
    ) => {
      if (!textMessage) return console.log("Error - No text Message Found");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

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
        sendTextMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
