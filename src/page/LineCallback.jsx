import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import api from "../api/Api";
import "./style/LineCallback.css";

// หน้ากลาง ๆ ที่ backend redirect กลับมาที่นี่หลัง login ผ่าน LINE สำเร็จ (เฉพาะบัญชีที่เคย
// ผูก LINE ไว้แล้ว - บัญชีใหม่จะถูกพาไปหน้า /register?line_pending=... แทน ดู Register.jsx)
// รับ token มาจาก query string แล้วเก็บลง localStorage เหมือน login ปกติ ก่อนพาไปหน้า dashboard
const LineCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login?error=line_invalid");
        return;
      }

      localStorage.setItem("token", token);

      try {
        const response = await api.get("/auth/me");
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));

        let targetUrl = "/user-dashboard";
        if (user.role === "admin") {
          targetUrl = "/admin-dashboard";
        } else if (user.role === "regulator") {
          targetUrl = "/regulator-dashboard";
        }
        navigate(targetUrl);
      } catch (error) {
        console.error("LINE Callback Error:", error);
        localStorage.removeItem("token");
        navigate("/login?error=line_server_error");
      }
    };

    finishLogin();
  }, [navigate]);

  return (
    <div className="line-callback-container">
      <FaSpinner className="line-callback-spin" />
      <p>กำลังเข้าสู่ระบบด้วย LINE...</p>
    </div>
  );
};

export default LineCallback;
