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

// SAFE TOKEN GETTER
const getToken = async () => {
  const user = auth.currentUser;

  if (!user) return null;

  try {
    return await user.getIdToken();
  } catch (err) {
    console.log("Token error:", err);
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    // ✅ SAFE HEADERS INIT (IMPORTANT FIX)
    config.headers = config.headers ?? {};

    if (token) {
      (config.headers as any).Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;