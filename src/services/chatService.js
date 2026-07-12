import api from "./api";

export const sendChatMessage = (message, conversationId, token) => {
  return api.post(
    "/chat",
    { message, conversationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const listConversations = (token) => {
  return api.get("/chat/conversations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getConversation = (id, token) => {
  return api.get(`/chat/conversations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};