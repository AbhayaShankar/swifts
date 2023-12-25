/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useCallback, useState } from "react";
import { UserType } from "../types";
import { baseUrl, postRequest } from "../utils/services";

// type TUserContext = [UserType[], React.Dispatch<React.SetStateAction<UserType[]>>];
// export const AuthContext = createContext<TUserContext>([[], () => null]);

export const AuthContext = createContext();

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, SetUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  console.log("regitserInfo", registerInfo);

  const updateRegisterInfo = useCallback((info: UserType) => {
    setRegisterInfo(info);
  }, []);

  // Register User Logic
  const registerUser = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (e: any) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);

      if (response?.error) {
        setRegisterError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));

      SetUser(response);
    },
    [registerInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerError,
        isRegisterLoading,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
