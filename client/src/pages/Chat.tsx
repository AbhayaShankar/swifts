import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chats/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chats/PotentialChats";
import { UserChatsType } from "../types";

const Chat: React.FC = () => {
  const { user } = useContext(AuthContext);

  const { userChats, isUserChatsLoading } = useContext(ChatContext);

  // console.log("User Chats", userChats);

  return (
    <div className="py-5">
      <PotentialChats />
      {(userChats as UserChatsType)?.length < 1 ? null : (
        <div className="flex items-center gap-5">
          <div className="pr-4 my-5">
            {isUserChatsLoading && (
              <p className="animate-pulse">Loading chats...</p>
            )}
            {userChats?.map((chat, index) => (
              <div className="" key={index}>
                <UserChat chat={chat} user={user} />
              </div>
            ))}
          </div>
          <div>ChatBox</div>
        </div>
      )}
    </div>
  );
};

export default Chat;
