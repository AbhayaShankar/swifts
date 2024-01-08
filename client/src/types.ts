export type UserType = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password: string;
};

export type LoginUserType = Omit<UserType, "name">;

export type ErrorType = {
  error: boolean;
  message: string;
};

export type UserChatsType = userChatType[];

export type userChatType = {
  _id: string;
  members: string[];
};

export type MessageType = {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
};

export type MessagesType = MessageType[];

export type OnlineUserType = {
  userId: string;
  socketId: string;
};

export type OnlineUsersType = OnlineUserType[];

export type AuthContextType = {
  user: UserType | null;
  registerInfo: UserType;
  loginInfo: LoginUserType;
  updateRegisterInfo: (info: UserType) => void;
  registerError: ErrorType | null;
  isRegisterLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerUser: (e: any) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loginUser: (e: any) => Promise<void>;
  updateLoginInfo: (info: LoginUserType) => void;
  loginError: ErrorType | null;
  isLoginLoading: boolean;
  logoutUser: () => void;
};

export type ChatContextType = {
  potentialChats: UserType[];
  userChats: UserChatsType | null;
  currentChat: userChatType | null;
  userChatsError: ErrorType | null;
  isUserChatsLoading: boolean;
  createChat: (firstId: string, secondId: string) => Promise<void>;
  updateCurrentChat: (chat: userChatType) => void;
  messages: MessagesType | null;
  isMessagesLoading: boolean;
  messagesError: ErrorType | null;
  sendTextMessage: (
    textMessage: string,
    sender: string | undefined,
    currentChatId: string | undefined,
    setTextMessage: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;
  onlineUsers: OnlineUsersType;
};
