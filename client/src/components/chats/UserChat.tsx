import React from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipients";
import avatar from "../../assets/avatar.svg";

const UserChat: React.FC = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);

  console.log("Recipient User", recipientUser);

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
        <span className="user-online"></span>
      </div>
    </div>
  );
};

export default UserChat;
