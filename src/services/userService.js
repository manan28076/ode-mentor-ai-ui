import api from "./api";

export const getUserProfile = (token) => {
  return api.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};