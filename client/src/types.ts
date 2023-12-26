export type UserType = {
  name: string;
  email: string;
  password: string;
};

type RegisterErrorType = {
  error: boolean;
  message: string;
};

export type AuthContextType = {
  user: UserType | null;
  registerInfo: UserType;
  updateRegisterInfo: (info: UserType) => void;
  registerError: RegisterErrorType | null;
  isRegisterLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerUser: (e: any) => Promise<void>;
  logoutUser: () => void;
};
