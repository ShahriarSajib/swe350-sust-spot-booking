import axios from "axios";
import API_BASE from "../../../config";

export const BASE_URL = `${API_BASE}/api/admin`;

export const adminApi = () => {
  const token = localStorage.getItem("adminToken");
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};
