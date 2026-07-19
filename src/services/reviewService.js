import api from "./api";

export const reviewCode = (data, token) => {
  return api.post("/review", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getReviewHistory = (token) => {
  return api.get("/review/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getDashboardStats = (token) => {
  return api.get("/review/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getReviewById = (id, token) => {
  return api.get(`/review/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};