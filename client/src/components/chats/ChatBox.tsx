import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipients";

const ChatBox: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { currentChat } = useContext(ChatContext);

  const { recipientUser } = useFetchRecipientUser({ chat: currentChat, user });

  if (!recipientUser) {
    return <p>No Conversation selected yet...</p>;
  }

  return <div>ChatBox</div>;
};

export default ChatBox;
