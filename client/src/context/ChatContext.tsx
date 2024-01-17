/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useCallback, useEffect, useState } from "react";
import {
  ChatContextType,
  ErrorType,
  MessageType,
  MessagesType,
  NotificationType,
  NotificationsType,
  UserChatsType,
  UserType,
  userChatType,
} from "../types";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

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
  const [newMessage, setNewMessage] = useState<MessageType | null>(null);
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState<NotificationsType | []>(
    []
  );
  const [allUsers, setAllUsers] = useState<UserType[]>([]);

  console.log("online Users", onlineUsers);
  console.log("notifications", notifications);
  console.log("messages", messages);

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
  }, [socket, user?.id]);

  // send realtime message using socket
  useEffect(() => {
    if (socket === null) return;

    const recipientId: string | undefined = currentChat?.members.find(
      (id) => id !== user?.id
    );

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage, user?.id]);

  // Receive Message and Notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

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
      setAllUsers(response);
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

  const markAllNotificationAsRead = useCallback(
    (notifications: NotificationsType) => {
      const mNotifications = notifications.map((notif) => ({
        ...notif,
        isRead: true,
      }));

      setNotifications(mNotifications);
    },
    []
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const openChatFromNotification = useCallback(
    (
      clickedNotif: NotificationType,
      userChats: UserChatsType | null,
      user: UserType | null,
      notifications: NotificationsType
    ) => {
      // find  chat to open
      const desiredChat =
        userChats &&
        userChats.find((chat) => {
          const chatMembers = [user?.id, clickedNotif?.senderId];

          const isDesired = chat?.members.every((member) => {
            return chatMembers.includes(member);
          });

          return isDesired;
        });

      if (!desiredChat) {
        console.error("Desired chat not found");
        return;
      }

      // mark clicked notification as read.
      const mNotification = notifications.map((el) => {
        if (clickedNotif.senderId === el.senderId) {
          return { ...clickedNotif, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotifications(mNotification);
    },
    []
  );

  const markSelectedNotificationsAsRead = useCallback(
    (
      individualUserNotification: NotificationsType,
      notifications: NotificationsType
    ) => {
      // mark notif as read

      const mNotifications = notifications.map((notif) => {
        let notification;

        individualUserNotification?.forEach((n) => {
          if (n.senderId === notif.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = notif;
          }
        });
        return notification;
      });

      setNotifications(mNotifications);
    },
    []
  );

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
        newMessage,
        sendTextMessage,
        onlineUsers,
        sendTextMessageError,
        notifications,
        allUsers,
        markAllNotificationAsRead,
        clearNotifications,
        openChatFromNotification,
        markSelectedNotificationsAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
