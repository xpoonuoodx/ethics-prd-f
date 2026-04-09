import React, { useState } from "react";
import "./style/Login.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import logo from "../assets/logo-bde.png"; // นำเข้าโลโก้จากโฟลเดอร์ assets ของคุณ

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // เพิ่ม Logic การเข้าสู่ระบบที่นี่
    console.log("Login submitted");
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
              <label htmlFor="email">อีเมลผู้ใช้งาน</label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
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

            <button type="submit" className="auth-login-submit-btn">
              เข้าสู่ระบบ
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
