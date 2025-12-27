import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // backend URL
  withCredentials: true,           // ✅ important for cookies
});
