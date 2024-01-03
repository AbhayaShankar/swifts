import React from "react";
import { UserType } from "../../types";

interface UserChatProps {
  user: UserType | null;
}

const UserChat: React.FC<UserChatProps> = ({ chat, user }) => {
  return <div>UserChat</div>;
};

export default UserChat;
