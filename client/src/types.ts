export type UserType = {
  id?: string;
  name: string;
  email: string;
  password: string;
};

export type LoginUserType = Omit<UserType, "name">;

type ErrorType = {
  error: boolean;
  message: string;
};

export type UserChatsType = userChatType[];

export type userChatType = {
  _id: string;
  members: string[];
};

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
  potentialChats: UserChatsType;
  userChats: UserChatsType | null;
  userChatsError: ErrorType | null;
  isUserChatsLoading: boolean;
};
