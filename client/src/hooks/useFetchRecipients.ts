import { useState, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId: string = chat?.members.find(
    (id: string) => id !== user?.id
  );

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      if (response.error) {
        setError(response);
      }

      setRecipientUser(response);
    };

    getUser();
  }, []);

  return { recipientUser };
};
