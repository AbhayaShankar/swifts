import React, { useContext } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipients";
import avatar from "../../assets/avatar.svg";
import { UserType, userChatType } from "../../types";
import { ChatContext } from "../../context/ChatContext";

interface UserChatInterface {
  chat: userChatType | null;
  user: UserType | null;
}

const UserChat: React.FC<UserChatInterface> = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser({ chat, user });

  const { onlineUsers } = useContext(ChatContext);

  return (
    <div className="user-card flex justify-between px-2 py-3 mb-1 hover:bg-white/[0.02] animate duration-150 ease-in cursor-pointer">
      <div className="flex">
        <div className="ml-2 mr-4">
          <img className="h-10 w-10" src={avatar} alt="Avatar" />
        </div>
        <div className="text-content">
          <div className="name capitalize font-medium">
            {recipientUser?.name}
          </div>
          <div className="text">Text Message</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="date mb-1">01/03/2024</div>
        <div className="this-user-notifications">2</div>
        <span
          className={`${
            onlineUsers?.some((user) => user?.userId === user?._id)
              ? "user-online"
              : ""
          }`}
        ></span>
      </div>
    </div>
  );
};

export default UserChat;
