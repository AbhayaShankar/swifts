/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useCallback, useEffect, useState } from "react";
import { AuthContextType, LoginUserType, UserType } from "../types";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, SetUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  console.log("Active User", user);
  console.log("Login User", loginInfo);

  useEffect(() => {
    const userString = localStorage.getItem("User");

    if (userString) {
      const user = JSON.parse(userString);
      SetUser(user);
    }
  }, []);

  const updateRegisterInfo = useCallback((info: UserType) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info: LoginUserType) => {
    setLoginInfo(info);
  }, []);

  // Register User Logic
  const registerUser = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);

      if (response?.error) {
        return setRegisterError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));

      SetUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(false);

      if (response?.error) {
        return setLoginError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));

      SetUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    SetUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerError,
        isRegisterLoading,
        registerUser,
        logoutUser,
        loginUser,
        loginInfo,
        isLoginLoading,
        loginError,
        updateLoginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
