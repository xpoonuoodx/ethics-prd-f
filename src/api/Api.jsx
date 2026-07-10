import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
});

let isTokenExpired = null;
let hasShownAlert = false; // ✅ ป้องกัน alert ซ้ำ

const checkTokenExpiration = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > payload.exp;
  } catch (error) {
    // ดักจับ error กรณี token ไม่ใช่รูปแบบที่ถูกต้อง (ป้องกันเว็บพัง)
    return true;
  }
};

// Interceptor
api.interceptors.request.use(
  (config) => {
    // ✅ แก้จุดที่ 1: ดึงคีย์ให้ตรงกับหน้า Login ("token") ป้องกันการดึงได้ค่า null
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem(import.meta.env.VITE_APP_TOKEN);

    // ✅ แก้จุดที่ 2: ต้องเช็คใหม่ทุกครั้งที่มีการยิง API ห้ามจำค่าเดิมไว้
    isTokenExpired = checkTokenExpiration(token);

    if (isTokenExpired) {
      if (!hasShownAlert) {
        // ✅ ตรวจสอบว่ามี alert ไปแล้วหรือยัง
        hasShownAlert = true;
        alert("Token has expired. Please log in again.");

        // ลบข้อมูลขยะเก่าออกให้เกลี้ยง
        localStorage.removeItem("token");
        localStorage.removeItem(import.meta.env.VITE_APP_TOKEN);
        localStorage.removeItem("role");
        localStorage.removeItem("user"); // เพิ่มการลบ user ป้องกันบั๊กหน้า Dashboard

        window.location.href = "/login";
      }
      return Promise.reject(new Error("Token expired"));
    }

    // ✅ รีเซ็ตสถานะ Alert หาก Token ปกติ (ป้องกันบั๊กการกด Back ในบราวเซอร์)
    hasShownAlert = false;

    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// อ่านข้อมูล user จาก localStorage แบบปลอดภัย กัน SyntaxError ทำเว็บขาวทั้งหน้า
// ถ้าค่าเสีย/parse ไม่ได้ จะเคลียร์ค่านั้นทิ้งแล้วคืน null แทนการ throw
export const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Corrupted 'user' data in localStorage, clearing it.", error);
    localStorage.removeItem("user");
    return null;
  }
};

export default api;
