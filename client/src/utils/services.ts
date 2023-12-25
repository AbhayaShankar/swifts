export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url: string, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.message;

    return { error: true, message };
  }

  return data;
};
