import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chats/UserChat";
import { AuthContext } from "../context/AuthContext";

const Chat: React.FC = () => {
  const { user } = useContext(AuthContext);

  const { userChats, userChatsError, isUserChatsLoading } =
    useContext(ChatContext);

  console.log("User Chats", userChats);

  return (
    <div>
      {userChats?.length < 1 ? null : (
        <div className="flex items-center gap-5">
          <div className="pr-4">
            {isUserChatsLoading && (
              <p className="animate-pulse">Loading chats...</p>
            )}
            {userChats?.map((chat, index) => (
              <div key={index}>
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
