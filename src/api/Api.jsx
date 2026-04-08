import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
});

let isTokenExpired = null;
let hasShownAlert = false; // ✅ ป้องกัน alert ซ้ำ

const checkTokenExpiration = (token) => {
  if (!token) return true;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  return currentTime > payload.exp;
};

// Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_APP_TOKEN);

    if (isTokenExpired === null || isTokenExpired === false) {
      isTokenExpired = checkTokenExpiration(token);
    }

    if (isTokenExpired) {
      if (!hasShownAlert) {
        // ✅ ตรวจสอบว่ามี alert ไปแล้วหรือยัง
        hasShownAlert = true;
        alert("Token has expired. Please log in again.");
        localStorage.removeItem(import.meta.env.VITE_APP_TOKEN);
        localStorage.removeItem("role");
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Token expired"));
    }

    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
