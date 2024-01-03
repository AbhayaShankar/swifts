import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

interface PotentialChatsProps {}

const PotentialChats: React.FC<PotentialChatsProps> = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat } = useContext(ChatContext);
  console.log("Potential Chats", potentialChats);

  return (
    <div>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <div
                key={index}
                className="single-user"
                onClick={() => createChat(user?.id, u._id)}
              >
                {u.name}
                <span className="user-online"></span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PotentialChats;
