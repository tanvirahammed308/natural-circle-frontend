import axios from "axios";
import { auth } from "./firebase";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// =========================
// AUTO ATTACH FIREBASE TOKEN
// =========================
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      // force refresh token (important for security)
      const token = await user.getIdToken(true);

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;