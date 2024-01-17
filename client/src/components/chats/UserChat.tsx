import React, { useContext } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipients";
import avatar from "../../assets/avatar.svg";
import { UserType, userChatType } from "../../types";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { momentDate } from "../../utils/momentDate";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";

interface UserChatInterface {
  chat: userChatType | null;
  user: UserType | null;
}

const UserChat: React.FC<UserChatInterface> = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser({ chat, user });
  const { onlineUsers, notifications, markSelectedNotificationsAsRead } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);

  const trimmedText = (text: string) => {
    let trimText = text.substring(0, 20);

    if (text.length > 20) {
      trimText = trimText + "...";
    }

    return trimText;
  };

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const unreadNotifications = unreadNotificationsFunc(notifications);

  // unreadNotif... contains all the unread notifications for the user. We want to display unread notif for all the users who have sent a message.
  const individualUserNotification = unreadNotifications.filter((notif) => {
    return notif.senderId === recipientUser?._id;
  });

  return (
    <div
      className="user-card flex justify-between px-2 py-3 mb-1 hover:bg-white/[0.02] animate duration-150 ease-in cursor-pointer"
      onClick={() => {
        if (individualUserNotification.length !== 0) {
          markSelectedNotificationsAsRead(
            individualUserNotification,
            notifications
          );
        }
      }}
    >
      <div className="flex">
        <div className="ml-2 mr-4">
          <img className="h-10 w-10" src={avatar} alt="Avatar" />
        </div>
        <div className="text-content">
          <div className="name capitalize font-medium">
            {recipientUser?.name}
          </div>
          <div className="text">
            {latestMessage
              ? trimmedText(latestMessage?.text)
              : "Start a conversation..."}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="date mb-1">{momentDate(latestMessage?.createdAt)}</div>
        <div
          className={
            individualUserNotification.length ? "this-user-notifications" : ""
          }
        >
          {individualUserNotification.length
            ? individualUserNotification.length
            : ""}
        </div>
        <span className={`${isOnline ? "user-online" : ""}`}></span>
      </div>
    </div>
  );
};

export default UserChat;
