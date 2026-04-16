import React, { useState } from "react";
import "./style/Login.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import logo from "../assets/logo-bde.png"; // นำเข้าโลโก้จากโฟลเดอร์ assets ของคุณ
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ไว้ทำปุ่มโหลด

  // State สำหรับเก็บค่าที่พิมพ์
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = `${import.meta.env.VITE_APP_API_ENDPOINT}/auth/login`;

      const response = await axios.post(API_URL, {
        username: username,
        password: password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      let targetUrl = "/";
      if (user.role === "admin") {
        targetUrl = "/admin-dashboard";
      } else if (user.role === "regulator") {
        targetUrl = "/regulator-dashboard";
      } else if (user.role === "provider") {
        targetUrl = "/provider-dashboard";
      } else if (user.role === "user") {
        targetUrl = "/user-dashboard";
      }

      window.location.href = targetUrl;
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";

      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: errorMessage,
        confirmButtonColor: "#75ba40",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-login-container">
      {/* ส่วนซ้าย: ฟอร์มเข้าสู่ระบบ */}
      <div className="auth-login-left">
        <a href="/" className="auth-login-back-btn">
          <FaArrowLeft /> กลับสู่หน้าหลัก
        </a>

        <div className="auth-login-form-wrapper">
          {/* ดึงโลโก้จากโฟลเดอร์ assets ของคุณ */}
          <img src={logo} alt="BDE Logo" className="auth-login-logo" />

          <h2>เข้าสู่ระบบ</h2>
          <p className="auth-login-subtitle">
            ยินดีต้อนรับ กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
          </p>

          <form onSubmit={handleLogin}>
            <div className="auth-login-input-group">
              {/* เปลี่ยนจาก อีเมลผู้ใช้งาน เป็น ชื่อผู้ใช้งาน เพื่อให้ตรงกับ Backend */}
              <label htmlFor="username">ชื่อผู้ใช้งาน (Username)</label>
              <input
                type="text"
                id="username"
                placeholder="กรอกชื่อผู้ใช้งานของคุณ"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="auth-login-input-group">
              <label htmlFor="password">รหัสผ่าน</label>
              <div className="auth-login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="auth-login-toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="auth-login-options">
              <a href="/forgot-password" className="auth-login-forgot-pass">
                ลืมรหัสผ่านใช่หรือไม่?
              </a>
            </div>

            {/* เพิ่มสถานะ Loading ในปุ่ม */}
            <button
              type="submit"
              className="auth-login-submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="auth-login-register-link">
            ยังไม่มีบัญชีผู้ใช้งาน? <a href="/register">ลงทะเบียนที่นี่</a>
          </p>
        </div>
      </div>

      {/* ส่วนขวา: รูปภาพ */}
      <div className="auth-login-right">
        {/* สามารถเปลี่ยน URL รูปภาพด้านล่างเป็นรูปภาพที่ต้องการได้ในไฟล์ CSS */}
        <div className="auth-login-image-overlay"></div>
      </div>
    </div>
  );
};

export default Login;
