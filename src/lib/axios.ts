import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 DEBUG (remove later if you want)
console.log("🔥 API BASE URL:", process.env.NEXT_PUBLIC_API_URL);

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();

    config.headers = config.headers || {};

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;