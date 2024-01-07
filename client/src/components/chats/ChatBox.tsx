import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipients";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, isMessagesLoading, messages, sendTextMessage } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser({ chat: currentChat, user });
  const [textMessage, setTextMessage] = useState("");

  console.log("text Message", textMessage);

  if (!recipientUser) {
    return (
      <p className="w-full text-center">No Conversation selected yet...</p>
    );
  }

  if (isMessagesLoading) {
    return <p className="w-full text-center">Loading...</p>;
  }

  return (
    <div className="flex flex-col chat-box w-full gap-4">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <div className="messages flex flex-col my-2 gap-2">
        {messages &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col message grow-0 w-fit break-words ${
                message.senderId === user?.id ? " self self-end" : " self-start"
              }`}
            >
              <span className="">{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </div>
          ))}
      </div>
      <div className="flex items-center chat-input grow-0 ">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="montserrat"
          borderColor="rgba(72,112,223,0.2)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendTextMessage(
                textMessage,
                user?.id,
                currentChat?._id,
                setTextMessage
              );
            }
          }}
        />
        <div>
          <button
            className=""
            onClick={() =>
              sendTextMessage(
                textMessage,
                user?.id,
                currentChat?._id,
                setTextMessage
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              className="stroke-blue-600 hover:stroke-blue-500 transition-all duration-100 ease-linear"
            >
              <path d="M15.379,19.1403 L12.108,12.5993 L19.467,5.2413 L15.379,19.1403 Z M4.86,8.6213 L18.76,4.5343 L11.401,11.8923 L4.86,8.6213 Z M3.359,8.0213 C2.923,8.1493 2.87,8.7443 3.276,8.9483 L11.128,12.8733 L15.053,20.7243 C15.256,21.1303 15.852,21.0773 15.98,20.6413 L20.98,3.6413 C21.091,3.2623 20.739,2.9093 20.359,3.0213 L3.359,8.0213 Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
