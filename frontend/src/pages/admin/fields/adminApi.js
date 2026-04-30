import axios from "axios";

export const BASE_URL = "http://localhost:5000/api/admin";

export const adminApi = () => {
  const token = localStorage.getItem("adminToken");
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};
