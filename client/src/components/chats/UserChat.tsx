import React, { useContext } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipients";
import avatar from "../../assets/avatar.svg";
import { UserType, userChatType } from "../../types";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { momentDate } from "../../utils/momentDate";

interface UserChatInterface {
  chat: userChatType | null;
  user: UserType | null;
}

const UserChat: React.FC<UserChatInterface> = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser({ chat, user });
  const {
    onlineUsers,
    notifications,
    messages,
    markSelectedNotificationsAsRead,
  } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const unreadNotifications = unreadNotificationsFunc(notifications);

  // Latest Messages from a user.
  const individualMessages = messages?.filter((msg) => {
    return msg.senderId === recipientUser?._id;
  });

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
            {individualMessages?.length
              ? individualMessages[individualMessages.length - 1].text
              : ""}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="date mb-1">
          {individualUserNotification.length
            ? momentDate(individualUserNotification[0].date)
            : ""}
        </div>
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
