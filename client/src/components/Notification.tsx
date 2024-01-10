import React, { useContext, useState } from "react";
import notificationIcon from "../assets/message.png";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { unreadNotificationsFunc } from "../utils/unreadNotifications";
import moment from "moment";

const Notification: React.FC = () => {
  const { user } = useContext(AuthContext);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationAsRead,
    clearNotifications,
    openChatFromNotification,
  } = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const modifiedNotifications = notifications.map((notif) => {
    const sender = allUsers.find((user) => user?._id === notif.senderId);

    return {
      ...notif,
      // only the first name
      senderName: sender?.name.split(" ")[0],
    };
  });

  console.log("u-notif", unreadNotifications);
  console.log("m-notif", modifiedNotifications);

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <img
          src={notificationIcon}
          alt="notif-icon"
          className={`h-7 w-7 hover:stroke-[#148b755d] hover:brightness-150 ${
            isOpen && "brightness-150 stroke-[#148b755d]"
          }`}
        />
        {!unreadNotifications.length ? null : (
          <span className="notification-count">
            <span>{unreadNotifications.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="drop-down"></div>
          <div className="notifications-header mb-1">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={() => markAllNotificationAsRead(notifications)}
            >
              Mark all as read
            </div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span className="notification">No Unread Notifications...</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications?.map((notif, index) => (
              <div
                key={index}
                className={
                  notif.isRead ? "notification" : "notification not-read"
                }
                onClick={() => {
                  openChatFromNotification(
                    notif,
                    userChats,
                    user,
                    notifications
                  ),
                    setIsOpen(false);
                }}
              >
                <span>{notif.senderName} sent you a new message</span>
                <span className="notification-time">
                  {moment(notif.date).calendar()}
                </span>
              </div>
            ))}
          <div
            className="flex justify-end cursor-pointer pr-1 mark-as-read hover:brightness-150"
            onClick={() => clearNotifications()}
          >
            Clear
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
