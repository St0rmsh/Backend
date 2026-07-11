import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default api;