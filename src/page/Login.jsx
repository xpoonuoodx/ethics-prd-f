import React, { useState } from "react";
import "./style/Login.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import logo from "../assets/logo-bde.png"; // นำเข้าโลโก้จากโฟลเดอร์ assets
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

      // --- กำหนดเส้นทางตาม Role ของผู้ใช้งาน ---
      let targetUrl = "/user-dashboard"; // ค่าเริ่มต้นสำหรับ user ทั่วไป

      if (
        user.role === "admin" ||
        (user.roles && user.roles.includes("admin"))
      ) {
        targetUrl = "/admin-dashboard";
      } else if (
        user.role === "regulator" ||
        (user.roles && user.roles.includes("regulator"))
      ) {
        targetUrl = "/regulator-dashboard"; // เพิ่มเงื่อนไขสำหรับ regulator
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
    <div className="premium-login-container">
      {/* ================= ส่วนซ้าย: ฟอร์มเข้าสู่ระบบ ================= */}
      <div className="premium-login-left">
        {/* แถบด้านบน */}
        <div className="premium-login-top-nav">
          <a href="/" className="premium-back-btn">
            <FaArrowLeft size={14} /> กลับสู่หน้าหลัก
          </a>
        </div>

        {/* กล่องฟอร์ม */}
        <div className="premium-form-wrapper">
          <div className="premium-brand-header">
            <img src={logo} alt="BDE Logo" className="premium-logo" />
          </div>

          <div className="premium-form-header">
            <h2>เข้าสู่ระบบ</h2>
            <p>ยินดีต้อนรับ กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อในระบบ</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* ช่องชื่อผู้ใช้งาน */}
            <div className="premium-input-group">
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

            {/* ช่องรหัสผ่าน */}
            <div className="premium-input-group">
              <label htmlFor="password">รหัสผ่าน</label>
              <div className="premium-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="premium-toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* ลืมรหัสผ่าน */}
            <div className="premium-form-options">
              <a href="/forgot-password" className="premium-forgot-pass">
                ลืมรหัสผ่านใช่หรือไม่?
              </a>
            </div>

            {/* ปุ่ม Submit */}
            <button
              type="submit"
              className="premium-submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* ลิงก์สมัครสมาชิก */}
          <div className="premium-register-prompt">
            <p>
              ยังไม่มีบัญชีผู้ใช้งาน? <a href="/register">ลงทะเบียนที่นี่</a>
            </p>
          </div>
        </div>
      </div>

      {/* ================= ส่วนขวา: รูปภาพและข้อความต้อนรับ ================= */}
      <div className="premium-login-right">
        <div className="premium-image-overlay">
          <div className="premium-hero-content">
            <div className="premium-glass-card">
              <h3>Thailand AI Ethics Guideline</h3>
              <p>
                โครงการสร้างความเข้าใจและส่งเสริมการใช้แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
                เพื่อสังคมดิจิทัลที่ปลอดภัยและยั่งยืน
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
