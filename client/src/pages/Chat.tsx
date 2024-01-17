import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chats/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chats/PotentialChats";
import { UserChatsType } from "../types";
import ChatBox from "../components/chats/ChatBox";

const Chat: React.FC = () => {
  const { user } = useContext(AuthContext);

  const { userChats, isUserChatsLoading, updateCurrentChat, currentChat } =
    useContext(ChatContext);

  return (
    <div className="py-5">
      <PotentialChats />
      {(userChats as UserChatsType)?.length < 1 ? null : (
        <div className="flex gap-5">
          <div className="pr-4 my-5">
            {isUserChatsLoading && (
              <p className="animate-pulse">Loading chats...</p>
            )}
            {userChats?.map((chat, index) => (
              <div
                onClick={() => updateCurrentChat(chat)}
                className=""
                key={index}
              >
                <UserChat
                  selected={chat === currentChat}
                  chat={chat}
                  user={user}
                />
              </div>
            ))}
          </div>
          <ChatBox />
        </div>
      )}
    </div>
  );
};

export default Chat;
