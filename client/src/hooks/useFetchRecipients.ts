import { useState, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { UserType, userChatType } from "../types";

interface UseFetchRecipientUserProps {
  chat: userChatType | null;
  user: UserType | null;
}

export const useFetchRecipientUser = ({
  chat,
  user,
}: UseFetchRecipientUserProps) => {
  const [recipientUser, setRecipientUser] = useState<UserType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const recipientId: string | undefined = chat?.members.find(
    (id) => id !== user?.id
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
  }, [recipientId]);

  return { recipientUser, error };
};
